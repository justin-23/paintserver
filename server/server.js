const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { response } = require('express');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

const SECRET_GUID = 'dc7ca909-12b2-4801-b9e7-2d3276ce714a';
const validateEmail = (email) => {
    //https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const validateName = (name) => {
    return String(name)
        .toLowerCase()
        .match(
            /^[\w]+$/
        )
}



const AuthDB = {

    connection: mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'paint',
    }, function() {
        console.warn("Error....?????");
    }),

    getAccountByName: function(name, callback) {
        
        AuthDB.connection.query(`SELECT * FROM accounts WHERE username = ?`, [name], function(err, res) {
            console.log("Check if name exists:", res, res && res.length > 0);
            return callback(res && res.length > 0, false || res[0]);
        });
    },
    getAccountByEmail: function(email, callback) {
        AuthDB.connection.query(`SELECT * FROM accounts WHERE email = ?`, [email], function(err, res) {
            console.log("Check if email exists:", email, res, res && res.length > 0);
            return callback(res && res.length > 0, false || res[0]);
        })
    },

    validateAccountDetails: function(name, email, password, confirm, callback) {

        switch (true) {
            case password.length < 5:
                callback("Password must be at least five chars", false); return false;
            case password != confirm:
                callback("Password and confirm value must be the same", false); return false;
            case validateEmail(email) == null:
                callback("Email entered is a invalid format.", false); return false;
            case validateName(name) == null:
                callback("Name entered contains non-word characters.", false); return false;
            default: break;
        }
        
        AuthDB.getAccountByName(name, function(found, sqlres) {
            console.warn("Checking... checking")
            if (found == true) {
                callback("There is already an account in this database with this name.", false);
                return false;
            } else {
                AuthDB.getAccountByEmail(email, function(found, sqlres) {
                    if (found == true) {
                        callback("There is already an account in this database with this email.", false);
                        return false;
                    } else {
                        callback(null, true);
                        return true;
                    }
                })
            }
        });
        // Good to go!  
    },

    createAccount: function(name, email, password, callback) {
        bcrypt.hash(password, 10 /* saltRounds */, function(err, hash) {
            // Store hash in your password AuthDB.
            AuthDB.connection.query(
                `INSERT INTO accounts (username, email, isadmin, hash) VALUES (?, ?, ?, ?);`, [name, email, 0, hash], function(err, res) {
                    if (err) {
                        callback(err, false);
                    } else {
                        callback(null, true);
                    }
                }
            )
        });
    },

    login: function(email, password, callback) {
        AuthDB.getAccountByEmail(email, function(success, sqlres) {
            if (success) {
            // If we've found an account at this email addr:
                bcrypt.compare(password, sqlres.hash, function(err, result) {
                // Check the password against the hash with bcrypt.
                    if (err) callback(false, err, {});
                    if (result == true) {
                        // Password was correct
                        callback(true, null, sqlres);
                        return true;
                    } else {
                        // wrong password
                        callback(false, "Password was incorrect. Please try again.", sqlres);
                        return false;
                    }
                });                
            } else {
                // Account not found...
                callback(false, "No account could be found with this email.", sqlres);
                return true;
            }
        })
    },

    punchIn: function(id) {
        AuthDB.connection.query(`INSERT INTO punches (?, ?, 1);`, [id, Date.now()], function(err, res) {
            console.log("Check if name exists:", res, res && res.length > 0);
            return callback(res && res.length > 0, false || res[0]);
        });
    },

    punchOut: function(id) {
        AuthDB.connection.query(`INSERT INTO punches (?, ?, 0);`, [id, Date.now()], function(err, res) {
            console.log("Check if name exists:", res, res && res.length > 0);
            return callback(res && res.length > 0, false || res[0]);
        });
    },

    getPunchesById: function(id) {
        AuthDB.connection.query(`SELECT * FROM punches WHERE id=?;`, [id], function(err, res) {
            console.log("Check if name exists:", res, res && res.length > 0);
            return callback(res && res.length > 0, false || res[0]);
        });
    }


}



const app = express();
var cookieSession = require('cookie-session');
const { Console } = require('console');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


const port = process.env.PORT || 5000;
// https://www.section.io/engineering-education/how-to-setup-nodejs-express-for-react/

app.listen(port, function(){
    console.log(`server launched on port ${port}.`);
});

app.get('/backend', (req, res) => {
    res.send({express: "Connected to react"});
});

app.post('/auth/login', (req, res) => {
// LOGIN
    const email = req.body.email;
    const password = req.body.password;

    AuthDB.login(email, password, function(success, error, sqlres){
    
        if (success) {
        // Login success
        // https://www.youtube.com/watch?v=j4Tob0KAuthDBuQ&t=2258s
            console.log(sqlres);
            const {username, isadmin} = sqlres;
            const claims = { username, isadmin };
            const accessToken = sign(claims, SECRET_GUID);
            res.status(200).json({
                accessToken,
                username,
                email,
                isadmin,
            })
        } else {
        // Login failed
            res.status(500).json({error}); 
        }

    });
});

app.post('/clock', (req, res) => {
    const { id, isin } = req.body;
})

app.post('/auth/newuser', (req, res) => {
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirm;

    AuthDB.validateAccountDetails(name, email, password, confirm, function(error, success) {
        if (success) {
        // Provided details are valid, go ahead
            AuthDB.createAccount(name, email, password, function(error, sqlres) {
                if (error) {
                // Database error
                    res.status(500).json({error: "SQL Database Error"});
                } else {
                // Account succesfully made!
                    res.status(200).json("Successfully created account");
                }
            });
        } else {
        // Details provided are invalid... :(
            res.status(500).json({error});
        }
    })

   
})

const authenticate = async function(fn) {
    //https://www.youtube.com/watch?v=j4Tob0KAuthDBuQ&t=2258s

}

app.get('/', function(req, res) {
    response.sendFile(path.join(__dirname + '/login.html'))
});



