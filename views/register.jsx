var React = require('react');

class Register extends React.Component {
  render() {
    return (
      <html>
        <body>
        <h1>Registration</h1>
          <form method="POST" action="/register">
            <p>
                Username
                <input name="name"/>
            </p>
            <p>
                password
                <input name="password"/>
            </p>
            <p>
                <input type="submit"/>
            </p>
          </form>
        </body>
      </html>
    );
  }
}

module.exports = Register;