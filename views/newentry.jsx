var React = require('react');

class Newentry extends React.Component {
  render() {
    return (
      <html>
        <body>
        <h1>New Entry</h1>
          <form method="POST" action="/home">
            <p>
                Title
                <input name="title" required/>
            </p>
            <p>
                Description
                <input name="description" required/>
            </p>
            <p>
                Start Date
                <input type="date" name="start_date" required/>
            </p>
            <p>
                End Date
                <input type="date" name="end_date" required/>
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

module.exports = Newentry;