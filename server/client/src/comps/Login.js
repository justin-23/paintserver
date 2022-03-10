import React from 'react';
import AuthService from '../services/auth.service';
import axios from 'axios';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            setLogin: () => {}
        }
    }
    
    setFormEmail(email) {
        this.setState({email});
    }

    setFormPassword(password) {
        this.setState({password})
    }

    
    submit(e) {
        e.preventDefault();
        const { email, password } = this.state;
        AuthService.login(email, password).then(
            () => {
                // Success
                alert("Successfully logged in");
                // Redirect to home page.
                this.props.setLogin();
            },
            (e) => {
                console.warn(e);
                alert('failure');    
            }

            
        );
    
    }
    render() {
        return (
            <form onSubmit={(e) => this.submit(e)}>
                <label>Email:<input type='text' name='email' id='login_email' onChange={(e) => this.setFormEmail(e.target.value)} /></label>
                <label>Password:<input type='text' name='password' id='login_password' onChange={(e) => this.setFormPassword(e.target.value)}/></label>
                <input type="submit" value="Login"></input>
            </form>
        )
    }
}

export default Login;
