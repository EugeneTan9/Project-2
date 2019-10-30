const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
var sha256 = require('js-sha256');
const cookieParser = require('cookie-parser');

var SALT = "project2";

if( process.env.DATABASE_URL ){

  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  configs = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
  };

}else{
  configs = {
    user: 'eugene',
    host: '127.0.0.1',
    database: 'project2',
    port: 5432
  };
}

const pool = new pg.Pool(configs);

const app = express();
app.use(express.static(__dirname+'/public/'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);
app.use(cookieParser());


app.get('/', (request, response) => {
    response.send("hi");
});

// render the register.jsx
app.get('/register', (request, response) => {
    response.render("register");
})

// insert the inputtedname and password into the table(users)
app.post('/register', (request, response) => {

    console.log(request.body);
    let name =  request.body.name;
    let hashedPassword = sha256(request.body.password + SALT);
    const array = [name, hashedPassword];

    const queryString = 'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *';

    pool.query(queryString, array, (err, result) => {

        if(err) {
            console.error("query error :",err.stack);
            response.redirect("register");
        }
        else {
            console.log("query result :", result);
            response.redirect("home");
        }
    });
});

// render the login.jsx
app.get('/login', (request, response) => {
    response.render("login");
});

// checking whether the inputted name and pw are matching the name and pw in the database to login
app.post('/login', (request, response) => {

    console.log("request.body");

    const inputtedName = [request.body.name];
    let inputtedpassword = request.body.password;

    const queryString = "SELECT * FROM users WHERE name =$1";

// checking whether the the inputted username === to the username in the table
    pool.query(queryString, inputtedName, (err, result) => {

        if(err) {
            console.error("query error", err.stack);
            response.send("query error");
        }
        else {
            console.log("query result :", result.rows);
// if there are usernames that corresponds with the inputtedusername then check if the inputted pw === to the table pw
            if(result.rows.length > 0) {

                let hashRequestedPassword = sha256(inputtedpassword + SALT);
                console.log("hashRequestedPassword :", hashRequestedPassword);
//          condition to check whether the inputted password === to the database password
                if(hashRequestedPassword === result.rows[0].password) {

                    let user_id = result.rows[0].id;
                    let hashedCookie = sha256(user_id + SALT);

// add in 2 cookies so that you can know which user it is inside the web pages and also to use it to extract its data from the database
                    response.cookie("user_id", user_id);
                    response.cookie("LoggedIn", hashedCookie);

                    response.redirect("home");
                }
                else {
                    response.status(403).send("wrong password");
                }

                }
                else{
                    response.status(403).send("wrong username");
            }
        }
    });
});

// render the home page if the user_id and LoggedIn cookie matches
app.get('/home', (request, response) => {
// checking whether it is the user
    let user_id = request.cookies["user_id"];
    let hashedValue = sha256(user_id + SALT);
    const id= [user_id];
    if(hashedValue === request.cookies["LoggedIn"]) {

// extracting all user's entries(data) from the database
        const queryString= 'SELECT * FROM entries WHERE user_id= $1 ORDER BY start_date ASC';

        pool.query(queryString,id, (err, result) => {

            if(err){
                console.error("query error :", err.message);
                response.send("query error");
            }
            else{
                console.log("query result :", result);
                console.log(result.rows, "RESULTS");
                const data= {
                entry : result.rows
                };
                // response.send(result.rows[0]);
                response.render("home", data);
            }
        });
    }
    else {
        response.redirect("login");
    }
});

// rendering the newentry.jsx to insert a new entry
app.get('/entry/new', (request, response) => {

    let user_id = request.cookies["user_id"];
    let hashedValue = sha256(user_id + SALT);

    if(hashedValue === request.cookies["LoggedIn"]) {
        response.render("newentry");
    }
    else {
    response.render("login");
    }
});

//   Inserting the inputted data into the database and redirecting back to home
app.post('/home', (request, response) => {

    console.log("request.body");

    let user_id=request.cookies["user_id"];
    let inputTitle= request.body.title;
    let inputDescription= request.body.description;
    let inputStart= request.body.start_date;
    let inputEnd= request.body.end_date;
    let arr= [user_id, inputTitle, inputDescription, inputStart, inputEnd];
    if(inputStart > inputEnd){
        console.log("date error");
        response.render("newentry");
    }
    else{
        const queryString= "INSERT INTO entries (user_id, title, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5)";
        pool.query(queryString, arr, (err,result) => {
            if(err) {
                console.error("query error", error.message);
                response.send("query error");
            }
            else{
                console.log("query result :", result);

                response.redirect("home");
            }
        });
    }
    // const queryString= "INSERT INTO entries (user_id, title, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5)";

    // pool.query(queryString, arr, (err, result) => {

    //     if(err) {
    //         console.error("query error", error.message);
    //         response.send("query error");
    //     }
    //     else {
    //         console.log("query result :", result);

    //         response.redirect("home");
    //     }
    // });
});

//  retrieving the data from only 1 entry and displaying it on the jsx. The user will be prevented from reading other users' entries
app.get('/entry/:id', (request, response) => {

    console.log(request.params.id);
    let userId = request.cookies["user_id"];
    let hashedValue = sha256(userId + SALT);


    if(hashedValue === request.cookies["LoggedIn"]) {

        const id = [request.params.id];
        const queryString= "SELECT * FROM entries WHERE id=$1";

        pool.query(queryString, id, (err, result) => {

            if(err) {
                console.error("query error ", err.message);
                response.send("query error");
            }
            else {
                console.log("query result :",result.rows[0]);
                console.log("user_id :", result.rows[0].user_id);
                console.log("userId :", userId);
                console.log(parseInt(userId) === result.rows[0].user_id)
                if(parseInt(userId) === result.rows[0].user_id) {

                    const data = {
                        entry : result.rows
                    };
                    response.render("entry", data);
                }
                else {
                    response.send("Sorry, entry not available")
                }
            }
        });
    }
    else {
    response.render("login");
    }
});

// render the entry of the user that he is finding. If its another user's entry he will be blocked from seeing
app.get('/entry/:id/edit', (request, response) => {

    console.log(request.params.id);
    let userId = request.cookies["user_id"];
    let hashedValue = sha256(userId + SALT);


    if(hashedValue === request.cookies["LoggedIn"]) {

        const id = [request.params.id];
        const queryString= "SELECT * FROM entries WHERE id=$1";

        pool.query(queryString, id, (err, result) => {

            if(err) {
                console.error("query error ", err.message);
                response.send("query error");
            }
            else {
                console.log("query result :",result.rows[0]);
                console.log("user_id :", result.rows[0].user_id);
                console.log("userId :", userId);
                console.log(parseInt(userId) === result.rows[0].user_id)
                if(parseInt(userId) === result.rows[0].user_id) {

                    response.render("update", result.rows[0]);
                }
                else {
                    response.send("Sorry, entry not available")
                }
            }
        });
    }
    else {
    response.render("login");
    }
});

app.post('/entry/:id/progress', (request, response) => {

    let progress = true;
    const arr = [progress, request.params.id];

    const queryString = "UPDATE entries SET progress=$1 WHERE id=$2";

    pool.query(queryString, arr, (err, result) => {

        if(err) {
            console.error("query error", err.message);
            response.send("query error");
        }
        else{
            response.redirect("/home");
        }
    });
});

// Update the existing entry
app.put('/entry/:id', (request, response) => {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

    console.log(request.body);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

    let title = request.body.title;
    let description = request.body.description;
    let start_date = request.body.start_date;
    let start = new Date(start_date);
    let formattedStart = `${start.getDate()}/${start.getMonth()+1}/${start.getFullYear()}`
    let end_date = request.body.end_date;
    let end = new Date(end_date);
    let formattedEnd = `${end.getDate()}/${end.getMonth()+1}/${end.getFullYear()}`
    let id = request.params.id;
    const arr = [title, description, formattedStart, formattedEnd, id];
    console.log("arr", arr);

// check whether the start date is later than the end date. If it is it will reload the page
    if(formattedStart > formattedEnd){
        console.log("date error");
        response.redirect("/entry/"+ id + "/edit");
    }
    else{
        const queryString="UPDATE entries SET title=$1, description=$2, start_date=$3, end_date=$4 WHERE id=$5";

        pool.query(queryString,arr, (err, result) => {

            if(err){
                console.error("query error :", err.message);
                response.send("query error");
            }
            else{
                console.log("query result :", result);

                response.redirect("/home");
            }
        });
    }
    // const queryString = "UPDATE entries SET title=$1, description=$2, start_date=$3, end_date=$4 WHERE id=$5";

    // pool.query(queryString, arr, (err, result) => {

    //     if(err) {
    //         console.error("query error :", err.message);
    //         response.send("query error");
    //     }
    //     else {
    //         response.redirect("/home");
    //     }
    // });
});



app.delete('/entry/:id', (request, response) => {

    const id = [request.params.id];

    const queryString = "DELETE FROM entries WHERE id=$1";

    pool.query(queryString, id, (err, result) => {

        if(err) {
            console.error("query error", err.message);
            response.send("query error");
        }
        else {
            response.redirect("/home");
        }
    });
});

app.get('/project/create', (request, response) => {

    let userId = request.cookies["user_id"];
    let hashedValue = sha256(userId + SALT);

    if(hashedValue === request.cookies["LoggedIn"]) {

        response.render("project");
    }
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log('~~~ Tuning in to the waves of port '+PORT+' ~~~'));