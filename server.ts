import http = require('http');
import dgram = require('dgram');
import url = require('url');
import qs = require('querystring');

const sock = dgram.createSocket('udp4');

http.createServer(function (req, res) {
    var urlQ = url.parse(req.url);

    if (urlQ.pathname != '/callback/') {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid pathname.');

        return;
    }

    var query = qs.parse(req.url, '?', '=');
    var code = query['code'];

    sock.send(code, 7841, req.connection.remoteAddress.substr(7), (err) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Failed to send code over UDP.');

        sock.close();

        return;
    });

    sock.send(code, 7841, req.connection.localAddress.substr(7), (err) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Failed to send code over UDP.');

        sock.close();

        return;
    });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<!DOCTYPE html><html><body><script>window.close();</script></body></html>');
}).listen(80);
