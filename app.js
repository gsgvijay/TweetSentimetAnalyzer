var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


var twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY ;
var twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET ;
var twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN ;
var twitterAccessSecret = process.env.TWITTER_ACCESS_SECRET ;


var twitter = require('ntwitter') ;
var twit = new twitter({
	consumer_key: twitterConsumerKey ,
	consumer_secret: twitterConsumerSecret,
	access_token_key: twitterAccessToken,
	access_token_secret: twitterAccessSecret
}) ;

var loveArray = new Array() ;
var hateArray = new Array() ;


twit.stream('statuses/filter', {'track': 'love'}, function(stream) {
	stream.on('data', function (data) {
		var name = data.user["name"] ;
		var tweet = data.text ;
		var arr = [name, tweet] ;
		loveArray.push(arr) ;
		console.log(name + "\t" + tweet) ;
	});
});

twit.stream('statuses/filter', {'track': 'hate'}, function(stream) {
	stream.on('data', function (data) {
		var name = data.user["name"] ;
		var tweet = data.text ;
		var arr = [name, tweet] ;
		hateArray.push(arr) ;
		console.log(name + "\t" + tweet) ;
	});
});


var server = require('http').createServer(app) ;
var port = 3000 ;
server.listen(port) ;

var sio = require('socket.io').listen(server) ;
sio.sockets.on('connection', function(socket)	{
	console.log('Connected...') ;
	setInterval(function()	{
		socket.emit('tweet', loveArray, hateArray) ;
		loveArray = new Array() ;
		hateArray = new Array() ;
	}, 3000) ;
}) ;
