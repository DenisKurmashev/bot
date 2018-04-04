const http  = require('http'),
      url   = require('url'),
      query = require('querystring'),
      logic = require('./logic');

const PORT = process.env.PORT || 3000;

const app = http.createServer((req, res) => {
    console.log(req.method + ' ' + req.url);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    
    // if bot have a message
    // parse get params to get text of message
    let data   = url.parse(req.url, true),
        mess   = '',
        sender = '';
    for (let key in data.query) {
        if (key == 'm') mess = query.unescape(data.query[key]);
        if (key == 's') sender = data.query[key];
    }    

    // send response message
    logic.auth();
    logic.send(mess, sender);
});

app.listen(PORT, () => {
    console.log('Server start. PORT - ' + PORT);
});

