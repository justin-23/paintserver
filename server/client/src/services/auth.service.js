//https://www.bezkoder.com/react-jwt-auth/

import axios from "axios";
const API_URL = "http://localhost:3000/auth/";
class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          console.log("Found jwt: ", response.data.accessToken);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(, email, password) {
    return axios.post(API_URL + "signup", {
      ,
      email,
      password
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }

  punchIn(id) {
    const isin = 1;
    return axios
      .post(API_URL + "clock", {
        id, isin,
      })
      .then(response => {
        
      })
  }
}
export default new AuthService();