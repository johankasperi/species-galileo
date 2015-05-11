var io = require('socket.io-client');
var mraa = require('mraa');
var socket = io('http://species-kspri.rhcloud.com');
var _ = require('underscore');

var digPins = [];
setupPins([9, 10, 11]); // Edit this line to decide which pins to use

var timeout = null;
var connectedClients = [];

// Connect to server
socket.on('connect', function() {
	socket.emit('board-connection', {});
});

socket.on('specie-isTouched', function(data) {
	if(data.bool == true) {
		startMakingSound(data.value, data.client);
	}
	else {
		stopMakingSound(data.value, data.client);
	}
})

socket.on('otherSpecie-isTouched', function(data) {
	if(data.bool == true) {
		startMakingSoundOtherSpecie(data.value);
	}
	else {
		stopMakingSoundOtherSpecie(data.value);
	}
})

function startMakingSound(value, clientId) {
	var client = _.findWhere(connectedClients, { id: clientId });
	if(client) {
		client.timing = value;
	}
	else {
		connectedClients.push({
			id: clientId,
			timing: value
		})
	}
	if(!timeout) {
		blink(true);
	}
}

function stopMakingSound(value, clientId) {
	connectedClients = _.reject(connectedClients, function(c) { return c.id === clientId });
	if(connectedClients.length < 1) {
		clearTimeout(timeout);
		timeout = null;
		writePin(0);
	}
}

function startMakingSoundOtherSpecie(value) {
}

function stopMakingSoundOtherSpecie(value) {
}

function blink(bool) {
	writePin(bool ? 1 : 0);
	bool = !bool;
	timeout = setTimeout(function() {
		blink(bool);
	}, getTiming(bool));
}

function getTiming(bool) {
	var min = _.min(connectedClients, function(c) { return c.timing });
	var sV = min.timing;
	if(connectedClients.length != 1) {
		var sum = 0;
		for(var i = 0; i<connectedClients.length; i++) {
			sum += connectedClients[i].timing;
		}
		var sV = min - (sum/min);
	}
	if(bool) {
		var p = 5000/sV + randomIntFromInterval(0,500/(sV/10));
	}
	else {
		var p = 5*sV + randomIntFromInterval(0,5*sV);
	}
	return p;
}

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function setupPins(pins) {
	for(var i = 0; i<pins.length; i++) {
		var pin = new mraa.Gpio(pins[i]);
		pin.dir(mraa.DIR_OUT);
		pin.write(0);
		digPins.push(pin);
	}
}

function writePin(bool) {
	for(var i = 0; i<digPins.length; i++) {
		digPins[i].write(bool);
	}
}