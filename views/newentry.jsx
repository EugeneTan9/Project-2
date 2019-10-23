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
                <input name="title"/>
            </p>
            <p>
                Description
                <input name="description"/>
            </p>
            <p>
                Start Date
                <input type="date" name="start_date"/>
            </p>
            <p>
                End Date
                <input type="date" name="end_date"/>
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