var React = require('react');

class Newentry extends React.Component {
  render() {
    let currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var dateString = year + "-" +(month + 1) + "-" + date;
    console.log(dateString);
    return (
      <html>
        <body>
        <h1>New Entry</h1>
          <form method="POST" action="/home">
            <p>
                Title :
                <input name="title" placeholder=" Title" required/>
            </p>
            <p>
                Description :
                <textarea rows="4" cols="50" name="description" placeholder="description"/>
            </p>
            <p>
                Start Date :
                <input type="date" name="start_date" required min={dateString}/>
            </p>
            <p>
                End Date :
                <input type="date" name="end_date" required min={dateString}/>
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