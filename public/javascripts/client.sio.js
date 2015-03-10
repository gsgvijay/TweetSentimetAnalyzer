
// The following two statements are used to create an instance of Socket.io
//     and connect it with the one that is created by the server.
var server = 'http://127.0.0.1:3000' ;
var socket = io.connect(server) ;


// The following two statements create a couple of variables that are used to
//     count the total number of tweets that contain the words love and hate
//     respectively.
var loveCount = 0 ;
var hateCount = 0 ;


// The following two statements are used to import the Google's chart library
//     that is used to display the Love Count - Hate Count ratios as a graph.
google.load('visualization', '1.0', {'packages':['corechart']}) ;
google.setOnLoadCallback(drawChart) ;


// The following is the callback function that is defined to accept the tweets
//     from the server. It also increments the love and hate count in tweets by
//     the appropriate amount.
socket.on('tweet', function(loveArray, hateArray)	{
	var tweetList = $('ul.tweet_list') ;
	var string = "" ;
	for(var i=0; i<loveArray.length; i++)	{
		string += "<li>" + loveArray[i][0] + "<ul> <li>" + loveArray[i][1] + "</li> </ul>" + "\n" ;
	}
	for(var i=0; i<hateArray.length; i++)	{
		string += "<li>" + hateArray[i][0] + "<ul> <li>" + hateArray[i][1] + "</li> </ul>" + "\n" ;
	}
	tweetList.prepend(string) ;
	loveCount += loveArray.length ;
	hateCount += hateArray.length ;

	drawChart() ;
}) ;


// The following is the function that is passed the data to the Google's chart library
//     and displays the resultant graph at the designated location (using the div tag).
function drawChart()	{
	var data = new google.visualization.DataTable() ;
	data.addColumn('string', 'Type') ;
	data.addColumn('number', 'Number') ;
	data.addRows([
		['Hate', hateCount],
		['Love', loveCount]
	]) ;
	var options = {'title': 'Love-Hate Ratio',
					'width':400,
					'height':300} ;
	var chart = new google.visualization.BarChart(document.getElementById('chart_div')) ;
	chart.draw(data, options) ;
}
