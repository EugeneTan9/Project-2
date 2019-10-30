var React = require('react');

class Register extends React.Component {
  render() {
    return (
      <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"/>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
        <link rel="stylesheet" href="/login-style.css"/>
      </head>
        <body>
            <div class="container">
                <h2>Registration</h2>
                <form method="POST" action="/register">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="name" class="form-control" id="name" placeholder="Enter username" name="name" required/>
                    </div>
                    <div class="form-group">
                        <label for="pwd">Password:</label>
                        <input type="password" class="form-control" id="pwd" placeholder="Enter password" name="password" required/>
                    </div>
                    <button type="submit" class="btn btn-default">Submit</button>
                </form>
                <a href="/login"><button class="btn btn-default">Login</button></a>
            </div>
        </body>
      </html>
    );
  }
}

module.exports = Register;