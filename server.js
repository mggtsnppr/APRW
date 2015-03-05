var
	ws = require("nodejs-websocket"),
	LocalStorage = require('node-localstorage').LocalStorage;
if (typeof localStorage === "undefined" || localStorage === null) {
    localStorage = new LocalStorage('./scratch');
}
if (!localStorage.getItem('test')) {
	localStorage.setItem('test', 'testIt');
	console.log('var set');
}

function broadcast(server, msg) {
    server.connections.forEach(function (conn) {
        conn.sendText(msg);
    });
}

var data = {
	rows: [
		[]
	]
};

var server = ws.createServer(function (conn) {
    console.log("New connection (" + server.connections.length + ")");
    conn.on("text", function (str) {
        console.log("Received " + str);
        conn.sendText(str.toUpperCase() + "!!!");
        broadcast(server, 'hello!');
    });
    conn.on("close", function (code, reason) {
        console.log("Connection closed");
    });
}).listen(6789);
