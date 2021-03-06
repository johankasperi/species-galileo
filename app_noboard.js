var io = require('socket.io-client');
var socket = io('http://species-kspri.rhcloud.com');
var _ = require('underscore');

var timeout = null;
var stop = false;
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
	clearTimeout(timeout);
	timeout = null;
	stop = false;
	blink(true);
}

function stopMakingSound(value, clientId) {
	connectedClients = _.reject(connectedClients, function(c) { return c.id === clientId });
	if(connectedClients.length < 1) {
		stop = true;
		clearTimeout(timeout);
		timeout = null;
	}
}

function startMakingSoundOtherSpecie(value) {
}

function stopMakingSoundOtherSpecie(value) {
}

function blink(bool) {
	console.log(bool ? 1 : 0);
	if(!stop) {
		timeout = setTimeout(function() {
			bool = !bool;
			blink(bool);
		}, getTiming(bool));
	}
}

function getTiming(bool) {
	var min = _.min(connectedClients, function(c) { return c.timing });
	var sV = min.timing;
	if(connectedClients.length > 1) {
		var sum = 0;
		for(var i = 0; i<connectedClients.length; i++) {
			sum += Math.floor(connectedClients[i].timing);
		}
		var sV = min.timing - (sum/min.timing);
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