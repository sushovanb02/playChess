let app = require('http').createServer(handler);
let io = require('socket.io');
let ws = require("websocketserver");
let fs = require("fs");
let url = require("url");
let port = (process.env.PORT || 5000);
let queue = {
	'W' : [],
	'B' : [],
	'U' : [] //undefined (player does not care which color)
};

app.listen(port);
console.log("HTTP server listening on port " + port);

function handler(req, resp){
	let r_url = new URL("req.url").toString();
	if(r_url.pathname.substring(1) === "getport"){
		resp.writeHead(200, {"Content-Type" : "text/plain"});
		resp.write("" + port);
		resp.end();
	}
	else if(r_url.pathname === "/")
	{
		resp.writeHead(200, {"Content-Type" : "text/html"});
		var clientui = fs.readFileSync("chess.html");
		resp.write(clientui);
		resp.end();
	}
	else{
		var filename = r_url.pathname.substring(1),
		type;

		switch(filename.substring(filename.lastIndexOf(".") + 1)){
			case "html":
			case "htm":
			type = "text/html; charset=UTF-8";
			break;
			case "js":
			type = "application/javascript; charset=UTF-8";
			break;
			case "css":
			type = "text/css; charset=UTF-8";
			break;
			case "svg":
			type = "image/svg+xml";
			break;
			case "png":
			type= "image/png";
			break;
			default:
			type = "application/octet-stream";
			break;
		}
        fs.readFile(filename, function(err, content){
			if(err){
				resp.writeHead(404, {
					"Content-Type" : "text/plain; charset=UTF-8"
				});
				resp.write(err.message);
				resp.end();
			}
			else{
				resp.writeHead(200, {
					"Content-Type" : type
				});
				resp.write(content);
				resp.end();
			}
		});
	}
}