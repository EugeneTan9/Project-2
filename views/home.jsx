var React = require('react');

class Home extends React.Component {
  render() {
    console.log("TESTESTESTEST")
    let currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var dateString = year + "-" +(month + 1) + "-" + date;
    console.log(dateString);
    // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
    // console.log(this.props.entry)
    // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")

    // let inProgress = this.props.entry.filter(x=>x.progress === false);
    // let completed = this.props.entry.filter(x=>x.progress === true);
    let completed = this.props.entry.filter(x=>x.progress === true);
        let entry2 = completed.map(el => {

        let start = new Date(el.start_date);
        let formattedStart = `${start.getDate()}/${start.getMonth()+1}/${start.getFullYear()}`

        let end = new Date(el.end_date);
        let formattedEnd = `${end.getDate()}/${end.getMonth()+1}/${end.getFullYear()}`
        let url = "/entry/" + el.id + "/edit";
        let del = "/entry/" + el.id + '?_method=delete';
        let prog = "entry/" + el.id + "/progress";
        return (
            <a href={url}><div class="card">
                <div class="title">
                    <p class="title-p">{el.title}</p>
                    <form action={del} method="POST">
                    <input type="submit" class="del-btn" value=""/></form>
                </div>
                <p>Description: {el.description}</p>
                <p>Start : {formattedStart}</p>
                <p>End : {formattedEnd}</p>
            </div></a>
        )
    })


    let inProgress = this.props.entry.filter(el => el.progress === false);
    console.log(inProgress)
    // let entry = 'banana'
    let entry1 = inProgress.map(el => {

        let start = new Date(el.start_date);
        let formattedStart = `${start.getDate()}/${start.getMonth()+1}/${start.getFullYear()}`

        let end = new Date(el.end_date);
        let formattedEnd = `${end.getDate()}/${end.getMonth()+1}/${end.getFullYear()}`
        let url = "/entry/" + el.id + "/edit";
        let del = "/entry/" + el.id + '?_method=delete';
        let prog = "entry/" + el.id + "/progress";
        return (
            <a href={url}><div class="card">
                <div class="title">
                    <p class="title-p">{el.title}</p>
                    <div class="btn-container">
                    <form action={prog} method="POST">
                    <input type="submit" class="prog-btn" value=""/></form>
                    <form action={del} method="POST">
                    <input type="submit" class="del-btn" value=""/></form>
                    </div>
                </div>
                <p>Description: {el.description}</p>
                <p>Start : {formattedStart}</p>
                <p>End : {formattedEnd}</p>
            </div></a>
        )
    })


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
            <div class= "table">
                <div class="in-progress">
                    <h4>Work</h4>
                    <div class="in-prog">
                        {entry1}
                    </div>
                </div>
                <div class="in-progress">
                    <h4>Completed</h4>
                    <div class="in-prog">
                        {entry2}
                    </div>
                </div>
            </div>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/       X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="     sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        </body>
      </html>
    );
  }
}

module.exports = Home;