'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto-js');
const mustache = require('mustache')
const process = require('process')
const cookieParser = require('cookie-parser')
const users = require('../users/users')

var url = "";

const assert = require('assert');
const fs = require('fs');
const https = require('https');

const USER_COOKIE = 'userId'
const AUTH_COOKIE = 'auth'
const TEMPLATES_DIR = 'templates';

const CREATED = 201;
const SEE_OTHER = 303;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const UNAUTHORIZED = 401;
const SERVER_ERROR = 500;

var tempAuth;
var tempID;

function setupRoutes(app) {
    app.use(bodyParser.json());
    app.get('/', redirect(app));
    app.get('/login.html', getLoginPage(app))
    app.post('/login.html', loginUser(app))
    app.get('/registration.html', getRegisterPage(app))
    app.post('/registration.html', registerUser(app))
    app.get('/account.html', getUser(app))
    app.post('/account.html', backToLogin(app))

}

function backToLogin(app) {
    return function(request, response) {
        response.cookie("auth", -1, { maxAge: -1 });
        response.cookie("loggedIn", -1, { maxAge: -1 })
        response.redirect('login.html');
    }
}
function redirect(app) {
    return function(request, response) {
        response.redirect('login.html');
    }
}

function getLoginPage(app) {
    return function(request, response) {
        response.send(doMustache(app, 'login', {}))
    }
}

function getUser(app) {
    return function(request, response) {
        let userPromise = null;
        var currentUser = request.cookies.loggedIn
        userPromise = app.users.displayUser(request.cookies.auth, request.cookies.loggedIn, url);
        userPromise.then((res) => {
            if(res !== undefined) {
                response.send(doMustache(app, 'account', res))
            }
            else {
                response.redirect('login.html');
            }
            });
    }
}

function loginUser(app) {
    return function(request, response) {
        var form = {
            "email":request.body.email.trim(),
            "password":request.body.password.trim()
        }
        var good = true;
        var error = ""
        if(form.email === "" || form.password === "") {
            error = "All Fields must be filled in"
            good = false;
        }
        if(!form["email"].match(/^[\S]+@[\S]+/)) {
            error = "E-Mail Format is not good"
            good = false;
        }
        
        if(good) {
            var body = {"pw":form.password}
            let userPromise = null
            userPromise = app.users.loginUser(body, form.email, url);
            userPromise.then((auth) => {
                if(auth !== undefined) {
                    response.cookie("auth", auth, { maxAge: 86400*1000 })
                    response.cookie("loggedIn", form.email, { maxAge: 86400*1000 });
                    //tempAuth = auth;
                    //tempID = form.email;
                    response.redirect('account.html');                  
                }
                else {
                    var fillIn = {"_email":form.email}
                    response.send(doMustache(app, 'loginDNE', fillIn))
                }

            })
        }
        else {
            var fillIn = {"_email":form.email, "_error":error}
            response.send(doMustache(app, 'loginWithVals', fillIn))
        }
        
    }
}

function getRegisterPage(app) {
    return function(request, response) {
        response.send(doMustache(app, 'registration', {}))
    }
}

function registerUser(app) {
    return function(request, response) {
        var form = {
            "firstName":request.body.firstName.trim(),
            "lastName":request.body.lastName.trim(),
            "email":request.body.email.trim(),
            "password":request.body.password.trim(),
            "passwordConfirm":request.body.passwordConfirm.trim()
        }
        
        var good = true;
        var firstNameErr = ""
        var lastNameErr = ""
        var emailFormatErr = ""
        var passwordConfirmErr = ""
        var passwordLenErr = ""
        var passwordFormatErr = ""
        
        if(form["firstName"] == "") {
            good = false;
            firstNameErr = "First Name cannot be empty\n"
        }
        
        if(form["lastName"] == "") {
            good = false;
            lastNameErr = "Last Name cannot be empty\n"
        }
        
        if(!form["email"].match(/^[\S]+@[\S]+/)) {
            good = false;
            emailFormatErr = "E-Mail is not in correct format\n"
        }
        
        if(form["password"] !==form["passwordConfirm"]) {
            good = false;
            passwordConfirmErr = "Passwords do not match\n"
        }
        
        if(form["password"].length < 8) {
            good = false;
            passwordLenErr = "Password is not long enough\n"
        }
        if(!form["password"].match(/^(\S)*[0-9](\S)*$/)) {
            good = false;
            passwordFormatErr = "Password must have at least one digit\n"
        }
                
        var body = {"firstName":form.firstName,
            "lastName":form.lastName
        }
        
        if(good) {
            const userCookie = request.cookies[USER_COOKIE];
            let userPromise = null;
            if (typeof userCookie === 'undefined') {
                userPromise = app.users.newUser(body, form.password, form.email, url);
                userPromise.then((auth) => {
                    if(auth !== undefined) {
                        response.cookie("auth", auth, { maxAge: 86400*1000 });
                        response.cookie("loggedIn", form.email, { maxAge: 86400*1000 });
                        //tempAuth = auth;
                        //tempID = form.email;
                        response.redirect('account.html') 
                    }
                    else {
                        var fillIn = {"_firstName":form.firstName,
                                     "_lastName": form.lastName,
                                     "_email": form.email}
                        response.send(doMustache(app, 'registrationExists', fillIn))
                    }
                    
                //response.cookie(USER_COOKIE, auth, { maxAge: 86400*1000 });
                //response.cookie(AUTH_COOKIE, form.email, { maxAge: 86400*1000 })
                });
            }
            else {
                userPromise = Promise.resolve(userCookie);
            }
            return userPromise;
        }
        
        else {
        var fillIn = {"_firstName":form.firstName,
            "_lastName":form.lastName,
            "_email":form.email,
            "_firstNameErr":firstNameErr,
            "_lastNameErr":lastNameErr,
            "_emailFormatErr":emailFormatErr,
            "_passwordConfirmErr":passwordConfirmErr,
            "_passwordLenErr":passwordLenErr,
            "_passwordFormatErr":passwordFormatErr
        }
            response.send(doMustache(app, 'registrationWithVals', fillIn))
        }
    }
}

function doMustache(app, templateID, view) {
    return mustache.render(app.templates[templateID], view);
}

/************************** Initialization *****************************/

function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}

function serve(options) {
  const port = options.port;
  const app = express();
  app.users = users;
  app.use(cookieParser());
  app.locals.port = port;
  url = options.url;
  app.locals.authTimeout = options.authTimeout*1000;
  setupTemplates(app);
  app.use(bodyParser.urlencoded({extended: true}));
  setupRoutes(app);
  https.createServer({
    key: fs.readFileSync(`${options.sslDir}/key.pem`),
    cert: fs.readFileSync(`${options.sslDir}/cert.pem`),
  }, app).listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}

module.exports = {
  serve: serve
};