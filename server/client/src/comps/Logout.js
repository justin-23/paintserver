import React from 'react';
import AuthService from '../services/auth.service';
import axios from 'axios';

class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
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
        AuthService.logout();
        this.props.logout();
    }
    render() {
        return (
            <form onSubmit={(e) => this.submit(e)}>
                <input type="submit" value="Logout"></input>
            </form>
        )
    }
}

export default Logout
