var React = require('react');

class Entry extends React.Component {
  render() {

    let entry = this.props.entry.map(el => {

        let start = new Date(el.start_date);
        let formattedStart = `${start.getDate()}/${start.getMonth()+1}/${start.getFullYear()}`

        let end = new Date(el.end_date);
        let formattedEnd = `${end.getDate()}/${end.getMonth()+1}/${end.getFullYear()}`
        let url = "/entry/" + el.id +'?_method=delete';
        return (
            <div>
                <p>{el.title}</p>
                <p>{el.description}</p>
                <p>{formattedStart}</p>
                <p>{formattedEnd}</p>
                <form action={url} method="POST">
                <input type="submit" value="Delete"/>
                </form>
                </div>
        )
    })
    return (
      <html>
        <body>
        {entry}
        </body>
      </html>
    );
  }
}

module.exports = Entry;