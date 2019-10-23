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

app.get('/register', (request, response) => {
    response.render("register");
})

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
            response.send(result.rows);
        }
    });
});


app.get('/login', (request, response) => {
    response.render("login");
});

app.post('/login', (request, response) => {

    console.log("request.body");

    const inputtedname = [request.body.name];
    let inputtedpassword = request.body.password;

    const queryString = "SELECT * FROM users WHERE name =$1";

    pool.query(queryString, inputtedname, (err, result) => {

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

                    response.redirect("/");
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