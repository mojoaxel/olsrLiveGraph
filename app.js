var _ = require('lodash-node');
var fs = require('fs');
var path = require('path');
var nconf = require('nconf');
nconf.argv().env().file({ file: './settings.json' });

var dot = require('graphlib-dot')
var express = require('express');
var app = require('express.io')()
app.http().io()

/*
app.io.route('ready', function(req) {
	req.io.broadcast('new visitor')
})
*/

app.use('/static', express.static(path.join(__dirname, '/bower_components')));

// Send client html.
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/client.html')
});

app.get('/DOTgraph', function(req, res) {
	res.send(fs.readFileSync(nconf.get('topologyFile'), 'UTF-8'));
});

app.get('/graph', function(req, res) {
	var graph = dot.read(fs.readFileSync('topology.dot', 'UTF-8'));
	
	var nodes = _.map(graph.nodes(), function(node) {
		console.log(_.extend({ id: node }, graph.node(node)));
		return _.extend({ id: node }, graph.node(node));
	});
	
	var edges = _.map(graph.edges(), function(edge) {
		console.log(_.extend(edge, graph.edge(edge)));
		return _.extend(edge, graph.edge(edge));
	});
	
	res.json({
		nodes: nodes,
		edges: edges
	});
});

app.get('/api/edges', function(req, res) {
	res.send(graph._nodes);
})

app.listen(nconf.get('port'));
