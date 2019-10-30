var React = require("react");

class Project extends React.Component {
  render() {
    return (
      <html>
        <body>
        <div>
        <h1>Project</h1>
        <form action= "/project" method="POST">
        <p>Project Title :</p><input type="text" name="title" value="Title" required/><br/>
        <p>Member :</p><input type= "text" name="name" value="Name" required/><br/>
        <p>Member :</p><input type="text" name="name" value="Name" required/><br/>
        <p>Member :</p><input type="text" name="name" value="Name" required/><br/>
        <br/><input type="submit" value="Submit"/>
        </form>
        </div>
        </body>
      </html>
    )
  }
}

module.exports = Project;