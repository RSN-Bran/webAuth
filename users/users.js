const axios = require('axios')
const https = require('https')


function User() {
}

//Called when registering a user
User.prototype.newUser = function(body, password, email, url) {
    return axios.put(`${url}/users/${email}/?pw=${password}`, body, {httpsAgent: new https.Agent({ "keepAlive": true, "rejectUnauthorized": false})})
    .then((response) => {
        if(response.status === 303 || response.status === 401) {
            return -1;
        }
        else {
            return response.data.authToken;
        }
        
    }).catch((err) => {
        console.error(err)
    })
}

//Called when logging in a user
User.prototype.loginUser = function(body, email, url) {
    return axios.put(`${url}/users/${email}/auth`, body, {httpsAgent: new https.Agent({ "keepAlive": true, "rejectUnauthorized": false})})
    .then((response) => {
        if(response.status === 404 || response.status === 401) {
            return -1;
        }
        else {
            return response.data.authToken;
        }
    }).catch((err) => {
        console.error(err)
    })
}

//Called when getting user info
User.prototype.displayUser = function(authToken, email, url) {
    return axios.get(`${url}/users/${email}`, {"headers": {"Authorization":"bearer" + authToken}, httpsAgent: new https.Agent({ "keepAlive": true, "rejectUnauthorized": false})})
    .then((response) => {
        if(response.status === 404 || response.status === 401) {
            return -1;
        }
        else {
            return response.data;
        }
    }).catch((err) => {
        console.error(err)
    })
}

module.exports = new User();