const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
var sha256 = require('js-sha256');
const cookieParser = require('cookie-parser');

var SALT = "project2";

const configs = {
  user: 'eugene',
  host: '127.0.0.1',
  database: 'project2',
  port: 5432,
};


const pool = new pg.Pool(configs);

const app = express();


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
            response.send("query error");
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

    pool.query(queryString, inputtedName, (err, result) => {

        if(err) {
            console.error("query error", err.stack);
            response.send("query error");
        }
        else {
            console.log("query result :", result.rows);

            if(result.rows.length > 0) {

                let hashRequestedPassword = sha256(inputtedpassword + SALT);
                console.log("hashRequestedPassword :", hashRequestedPassword);

                if(hashRequestedPassword === result.rows[0].password) {

                    let user_id = result.rows[0].id;
                    let hashedCookie = sha256(user_id + SALT);

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

    let user_id = request.cookies["user_id"];
    let hashedValue = sha256(user_id + SALT);
    const id= [user_id];
    if(hashedValue === request.cookies["LoggedIn"]) {

        const queryString= 'SELECT * FROM entries WHERE user_id= $1';

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

app.get('/entry/new', (request, response) => {

    let user_id = request.cookies["user_id"];
    let hashedValue = sha256(user_id + SALT);

    if(hashedValue === request.cookies["LoggedIn"]) {
        response.render("newentry");
    }
    else {
    response.render("newentry");
    }
});

app.post('/home', (request, response) => {

    console.log("request.body");

    let user_id=request.cookies["user_id"];
    let inputTitle= request.body.title;
    let inputDescription= request.body.description;
    let inputStart= request.body.start_date;
    let inputEnd= request.body.end_date;
    let arr= [user_id, inputTitle, inputDescription, inputStart, inputEnd];

    const queryString= "INSERT INTO entries (user_id, title, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5)";

    pool.query(queryString, arr, (err, result) => {

        if(err) {
            console.error("query error", error.message);
            response.send("query error");
        }
        else {
            console.log("query result :", result);

            response.redirect("home");
        }
    });
});

app.get('/home/entry/:id')

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

let onClose = function(){

  console.log("closing");

  server.close(() => {

    console.log('Process terminated');

    pool.end( () => console.log('Shut down db connection pool'));
  })
};

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);