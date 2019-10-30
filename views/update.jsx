var React = require("react");

class Update extends React.Component {
  render() {
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
        <h1>Details of {this.props.title}</h1>
        <form action={"/entry/" + this.props.id +'?_method=put'} method="POST">
            <p>Title :</p><input type="text" name="title" value={this.props.title} required/><br/>
            <p>Description :</p><input type= "text" name="description" value={this.props.description} required/><br/>
            <p>Start Date :</p><input type="text" name="start_date" value={this.props.start_date.toString().slice(4, 15)} required/><br/>
            <p>End Date :</p><input type="text" name="end_date" value={this.props.end_date.toString().slice(4,15)} required/><br/>
            <br/><input type="submit" value="Submit"/>
        </form>
                    <form action={"/entry/"+ this.props.id + "?_method=delete"} method="POST">
            <input type="submit" class="update-del" value="delete"/></form>
        </div>
        </body>
      </html>
    )
  }
}

module.exports = Update;