// Create web server using Node.js
// Run: node comments.js
// Open browser and type: http://localhost:8081/comments.html

var http = require('http');
var fs = require('fs');
var qs = require('querystring');

var comments = [];
var comments_file = 'comments.txt';

function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    load_comments();
    if (req.method == 'POST') {
        collect_data(req, res);
    } else {
        show_form(req, res);
    }
}

function collect_data(req, res) {
    var body = '';
    req.on('readable', function () {
        var d = req.read();
        if (d) {
            if (typeof d == 'string') {
                body += d;
            } else if (typeof d == 'object' && d instanceof Buffer) {
                body += d.toString('utf8');
            }
        }
    });

    req.on('end', function () {
        var POST_data = qs.parse(body);
        add_comment(POST_data['comment']);
        show_comments(req, res);
    });
}

function show_form(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(
        `
        <html>
            <head>
                <title>Comments</title>
            </head>
            <body>
                <h1>Comments</h1>
                <form action="/" method="POST">
                    <textarea name="comment" cols="60" rows="4"></textarea><br />
                    <input type="submit" value="Submit comment" />
                </form>
            </body>
        </html>
        `
    );
}

function show_comments(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(
        `
        <html>
            <head>
                <title>Comments</title>
            </head>
            <body>
                <h1>Comments</h1>
                <ul>
                    ${comments.map(comment => `<li>${comment}</li>`).join('')}
                </ul>
                <a href="/">Submit another comment</a>
            </body>
        </html>
        `
    );
}

function add_comment(comment) {
    comments.push(comment);
    save_comments();
}

function save_comments()
{
    fs.writeFileSync(comments_file, JSON.stringify(comments), 'utf8');
}