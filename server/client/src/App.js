import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './comps/Login';
import Logout from './comps/Logout';
import AuthService from './services/auth.service';
class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));


    const user = AuthService.getCurrentUser();
    
    if (user) {
      const { isadmin,  } = user;
        console.log(user);
        this.setState({
            isLoggedIn: true,
            isadmin,
            ,
        })
    }

  }
    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  handleLoginSubmit

  render() {
    let updateLogin = () => {
      this.setState({ isLoggedIn: true});
    }

    updateLogin = updateLogin.bind(this);

    const { isLoggedIn, isadmin,  } = this.state;
    return (
      <div className="App">
        
        <div className="newuser">
          <form id="newuser_form" action="/auth/newuser" method="post">
            <label for=""></label>
            <input type="text" name="" placeholder="" id="" required />
				      <label for="password">
					    <i className="fas fa-lock"></i>				</label>
              <input type="text" name="email" placeholder="Email" id="email" required />
				    <input type="password" name="password" placeholder="Password" id="password" required />
            <input type="text" name="confirm" placeholder="Confirm PW" id="confirm" required />
				    <input type="submit" value="Register"></input>

          </form>
          <Login login={updateLogin}></Login>
          <Logout></Logout>
          <>
            { isLoggedIn && (
              <h1>Hello, { } </h1>
            )}

            { isLoggedIn && isadmin && (
              <h2>You're logged in as an admin</h2>
            )}
       
          </>
        </div>
        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;