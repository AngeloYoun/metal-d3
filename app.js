var express = require('express');
var app = express();

app.listen(
	8585,
	function() {
		console.log('listening on *:8585');
	}
);

app.use(express.static('docroot'));

app.get('/', function(req, res){
	res.sendFile(
		'index.html',
		{
			root: __dirname
		}
	);
});