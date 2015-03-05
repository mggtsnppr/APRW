var
	ws = require("nodejs-websocket"),
	LocalStorage = require('node-localstorage').LocalStorage,
    json = require('comment-json');
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

var initialData = [
	['БЛИЗКО - ВРИН', '', '11:00', '11:00', '4/3'],
	['ПЦ - ЕКАТЕРИНБУРГ', '', '11:30', '11:30', '1/3'],
	['Я ПОКУПАЮ', '', '12:00', '12:00', '1/2'],
	['ПЦ ДИРЕКЦИЯ', '', '12:30', '12:30', '4/2'],
	['ДК ДИРЕКЦИЯ', 'БЛИЗКО ЕКАТЕРИНБУРГ', '13:00', '13:00', '2/2'],
	['УПРАВЛЯЮЩАЯ', 'КОМПАНИЯ', '13:30', '13:30', '3/2'],
	['ДК ЕКАТЕРИНБУРГ', '', '14:00', '14:00', '2/1'],
	['ДОБРОЛЮБОВА 1', '', '14:30', '14:30', '2/1'],
	['ДОБРОЛЮБОВА 2', '', '17:00', '17:00', '2/1']
];

var server = ws.createServer(function (conn) {
	console.log("New connection (" + server.connections.length + ")");
	conn.on("text", function (str) {
		if (str == 'getInitial') {
			conn.sendText(json.stringify(initialData));
		}
		broadcast(server, 'hello!');
	});
	conn.on("close", function (code, reason) {
		console.log("Connection closed");
	});
}).listen(6789);
