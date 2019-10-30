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
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
            <link rel="stylesheet" href="/styles.css"/>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg ">
                <a class="navbar-brand" href="/home">LF</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item active">
                            <a class="nav-link" href="/entry/new">New <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Project</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="entry">
                <h1>New Entry</h1>
                <form method="POST" action="/home">
                    <p>Title: </p><input name="title" placeholder=" Title" required/><br/>
                    <p>Description:</p><textarea rows="4" cols="50" name="description" placeholder="Description"/><br/>
                    <p>Start Date:</p><input type="date" name="start_date" required min={dateString}/><br/>
                   <p>End Date:</p><input type="date" name="end_date" required min={dateString}/><br/>
                   <br/><input type="submit"/>
                 </form>
             </div>
        </body>
      </html>
    );
  }
}

module.exports = Newentry;