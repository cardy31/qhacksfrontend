import { Component } from 'react';
import React from 'react';
import LoginForm from "./LoginForm";
import Todos from "./Todos";

/* App component */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: []
    };
  }

  handle_logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    this.setState({ logged_in: false, username: '' });
  };

  handle_login = (e, data) => {
    e.preventDefault();
    let username = data.username;
    fetch('https://robcardy.com/api/api-token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(json => {
          localStorage.setItem('token', json['token']);
          this.setState({
            username: username
          });
          fetch('https://robcardy.com/api/user/', {
            method: 'GET',
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`
            },
          })
              .then(res => res.json())
              .then(json => {
                console.log("HERE: ", json[0]);
                for (let i = 0; i < json.length; i++) {
                    if (json[i]['username'] === username) {
                        console.log('ID: ', json[i]['ID']);
                        localStorage.setItem('user_id', json[i]['id']);
                    }
                }
              fetch('https://robcardy.com/api/scheduler/', {
                  method: 'GET',
                  headers: {
                      Authorization: `Token ${localStorage.getItem('token')}`
                  },
              })
                  .then(res => res.json())
                  .then(json => {
                      console.log(json[0]);
                      localStorage.setItem('todos', json);
                      this.render();
                  })
              })
        })
  }; // End handle_login


  render() {
    console.log(this.state);
    console.log("Token: ", localStorage.getItem("token"));
    console.log(typeof localStorage.getItem("token"));
    console.log(localStorage.getItem("token") === null);

    // User is logged in
    if (localStorage.getItem("token") === null) {
        return (
            <div>
                <LoginForm handle_login={this.handle_login}/>
            </div>
        )
    }
    // User is not logged in
    else {
        return (
            <div>
                <Todos todos={localStorage.getItem('todos')}/>
            </div>
        )
    }
  }
}

export default App;