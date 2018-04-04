const http = require('http'),
      fs   = require('fs'),
      path = require('path');

const BOT_NAME = 'newBot',
      BOT_TOKEN = '',
      SERVER_HOST = 'dnetw.herokuapp.com',
      CASH_PATH = path.join(__dirname, '../cash/cash.txt');

function auth() {
    if (getCash() != '') return;

    let options = {
        host: SERVER_HOST,
        method: 'POST',
        path: '/auth'
    };

    let data = 'name=' + BOT_NAME + '&pass=' + BOT_TOKEN;

    let req = http.request(options, (res) => {

        if (res.statusCode != 302) return;
        let authTokenArr = null, authToken = null;
        // parse headers and find set cookie header
        for (let key in res.headers) {
            if (key.toLowerCase() == 'set-cookie') authTokenArr = res.headers[key];
        }

        // find value of crypt token cookie
        for (let i = 0; i < authTokenArr.length; i++) {
            let data = authTokenArr[i].split(';')[0].split('=');
            if (data[0] == '_user_t') authToken = data[1];
        }

        // add this value to cash
        fs.writeFile(CASH_PATH, authToken, {encoding: 'utf8'}, null);
        
        res.on('error', (err) => {
            console.log(err);
        });
    });
    req.on('error', (err) => {
        console.log(err);
    });
    req.write(data);
    req.end();
}
function send(mess, reciver) {
    let cookie = '_user_t=' + getCash() + ';' + '_user_k=';

    let options = {
        host: SERVER_HOST,
        method: 'POST',
        path: '/api/sendMess'
    };

    // build post data
    let data = 'mess=' + mess + '&reciver=' + reciver;

    let req = http.request(options, (res) => {
        res.on('error', (err) => {
            console.log(err);
        })
    });
    req.on('error', (err) => {
        console.log(err);
    });
    // add auth cookie to request
    req.setHeader('Cookie', cookie);
    req.write(data);
    req.end();
}
function getCash() {
    // read cookie value from cash
    return fs.readFileSync(CASH_PATH).toString();
}

module.exports = {
    auth: auth,
    send: send,
    getCash: getCash
};