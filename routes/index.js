var express = require('express');
var router = express.Router();
var sentiment = require('sentiment');
var Twit = require('twit');
var Pubnub = require('pubnub');
var fs = require('fs');
var nconf = require('nconf');
var moment = require('moment');

nconf.file({ file: 'config.json' }).env();

var twitter = new Twit({
	consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
	consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
	access_token: nconf.get('TWITTER_ACCESS_TOKEN'),
	access_token_secret: nconf.get('TWITTER_TOKEN_SECRET')
});

var pubnub = Pubnub({
	publish_key: nconf.get('PUBNUB_PUBLISH_KEY'),
	subscribe_key: nconf.get('PUBNUB_SUBSCRIBE_KEY')
});

var stream;
var cachedTweet;
var publishInterval;

/**
 * Starts Twitter stream and publish interval
 */
function start () {

	// If the stream does not exist create it
	if (!stream) {

		// Connect to stram and filter by a geofence that is the size of the Earth
		stream = twitter.stream('statuses/filter', { locations: '-180,-90,180,90' });

		// When Tweet is received only process it if it has geo data
		stream.on('tweet', function (tweet) {	
			if (tweet.coordinates) {
				// calculate sentiment with "sentiment" module
				tweet.sentiment = sentiment(tweet.text);

				// save the Tweet so that the very latest Tweet is available and can be published
				cachedTweet = tweet
			}
		});
	}
	// If the stream exists start it
	else {
		stream.start();
	}
	
	// Clear publish interval just be sure they don't stack up (probably not necessary)
	if (publishInterval) {
		clearInterval(publishInterval);
	}

	// Only publish a Tweet every 100 millseconds so that the browser view is not overloaded
	// This will provide a predicatble and consistent flow of real-time Tweets
	publishInterval = setInterval(function () {
		if (cachedTweet) {
			publishTweet(cachedTweet);
		}
	}, 100); // Adjust the interval to increase or decrease the rate at which Tweets sent to the clients
}

var lastPublishedTweetId;

/**
 * Publishes Tweet object through PubNub to all clients
 **/
function publishTweet (tweet) {

	if (tweet.id == lastPublishedTweetId) {
		return;
	}
	
	lastPublishedTweetId = tweet.id;

	pubnub.publish({
		post: false,
		channel: 'tweet_stream',
		message: tweet,
		callback: function (details) {
			// the goggles do nothing
		}
	});
}

/**
 * Defines route for root
 */
router.get('/', function (req, res) {
	
	start();

	// Render PubNub config for clien-side javascript to reference
  res.render('index', {
		subscribe_key: nconf.get('PUBNUB_SUBSCRIBE_KEY'),
		channel: 'tweet_stream',
		ga_tracking_id: nconf.get('GA_TRACKING_ID')
	});
});

/**
 * GET Starts stream
 */
router.get('/stream/start', function (req, res) {
	
	var response = { };

	start();

	response.message = 'Stream started.'

	res.send(response);
});

/**
 * GET Stops stream
 */
router.get('/stream/stop', function (req, res) {
	
	var response = { };

	if (stream) {
		stream.stop();
		clearInterval(publishInterval);
		response.message = 'Stream stopped.'
	}
	else {
		response.message = 'Stream was not started or has already been stopped.'
	}

	res.send(response);
});

var trends, trendsTimestamp;

/**
 * GET Returns trens from Twitter trends API
 */
router.get('/trends', function (req, res) {
	
	var now = moment();

	// Only allow request to trends api every 2 minutes to stay within rate limits
	if (trends && trendsTimestamp.diff(now, 'minutes') < 2 ) {
		// return trends from memory
	  res.send(trends);
	  return;
	}

	twitter.get('trends/place', { id: 1 }, function(err, data, response) {

		if (err) {
	  	res.send(err);
	  	return;
		}

		trends = data[0].trends
		trendsTimestamp = moment();
	  res.send(trends);
	});
});

module.exports = router;
