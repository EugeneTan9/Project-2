var React = require('react');

class Home extends React.Component {
  render() {

    let entry = this.props.entry.map(el => {

        let start = new Date(el.start_date);
        let formattedStart = `${start.getDate()}/${start.getMonth()}/${start.getFullYear()}`

        let end = new Date(el.end_date);
        let formattedEnd = `${end.getDate()}/${end.getMonth()}/${end.getFullYear()}`
        return (
            <div>
                <p>{el.title}</p>
                <p>{el.description}</p>
                <p>{formattedStart}</p>
                <p>{formattedEnd}</p>
                </div>
        )
    })
    return (
      <html>
        <body>

        <h1>Welcome</h1>
        {entry}
        </body>
      </html>
    );
  }
}

module.exports = Home;