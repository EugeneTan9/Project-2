var React = require("react");

class Update extends React.Component {
  render() {
    return (
      <html>
        <body>
        <div>
        <h1>Details of {this.props.title}</h1>
        <form action={"/entry/" + this.props.id +'?_method=put'} method="POST">
        <p>Title :</p><input type="text" name="title" value={this.props.title} required/><br/>
        <p>Description :</p><input type= "text" name="description" value={this.props.description} required/><br/>
        <p>Start Date :</p><input type="text" name="start_date" value={this.props.start_date} required/><br/>
        <p>End Date :</p><input type="text" name="end_date" value={this.props.end_date} required/><br/>
        <br/><input type="submit" value="Submit"/>
        </form>
        </div>
        </body>
      </html>
    )
  }
}

module.exports = Update;