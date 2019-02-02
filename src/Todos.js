import React from 'react';
import DataTable from './DataTable';

class Todos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'todos': this.props.todos,
            'rows': [],
            'name': "",
            'lengthOfTime': 0
        };
    }

    handle_change = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = { ...prevstate };
            newState[name] = value;
            return newState;
        });
    };

    componentDidMount() {
        this.updateRows();
        fetch('https://robcardy.com/api/scheduler/', {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                this.setState({ todos: json });
                this.updateRows(-1);
            });
    }

    updateRows = (num) => {
        let table = [];

        if (this.state['todos'] !== null) {
            for (let i = 0; i < this.state['todos'].length; i++) {
                if (this.state['todos'][i]['id'] !== num) {
                    table[i] = [];
                    table[i].push(<button onClick={this.handle_done}
                                          value={this.state['todos'][i]['id']}>Done</button>);
                    table[i].push(this.state['todos'][i]['name']);
                    table[i].push(this.state['todos'][i]['lengthOfTime']);
                }
            }
        }
        this.setState({
            'games': this.state['games'],
            'rows': table
        })
    };

    // deleteRows() {
    //
    // }

    handle_done(e) {
        let urlString = "https://robcardy.com/api/scheduler/" + e.target.value + "/";
        console.log(urlString);
        return fetch(urlString, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
        })
            .then(res => {
                console.log("res.status in delete =", res.status);
                this.updateRows(e.target.value)
            })
            .catch(err => {
                console.log(err);
            });

    }


    handle_post() {
        let body = {
            "user": localStorage.getItem("user_id"),
            "name": this.state["name"],
            "lengthOfTime": parseInt(this.state["lengthOfTime"])
        };

        let urlString = "https://robcardy.com/api/scheduler/";
        console.log(urlString);
        fetch(urlString, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                this.setState(prevstate => {
                    const newState = { ...prevstate };
                    newState['todos'] = json;
                    return newState;
                });
                this.updateRows();
            });
    }

    render() {

        console.log(this.state);

        return (
            <div>
                <h1>TODOs</h1>
                <DataTable rows={this.state['rows']} />
                <form onSubmit={e => this.handle_post(e, this.state)}>
                    <input type="text"
                           name="name"
                           value={this.state["name"]}
                           onChange={this.handle_change}
                />
                    <input type="text"
                           name="lengthOfTime"
                           value={this.state["lengthOfTime"]}
                           onChange={this.handle_change}
                    />
                    <input type="submit"/>
                </form>
            </div>
        );
    }
}

export default Todos;
