tweet-stream-globe
==========

A real-time 3D visualization of Tweets from around the world.

This web app attaches to the Twitter API stream/filter and runs rudimentry sentiment analysis on Tweets with geo data. Tweets are published via PubNub websockets and plotted to a 3D globe.

![Screenshot](screenshot.png?raw=true =858x "Screenshot")
[Video Capture](https://vimeo.com/104759844) | [Running Demo](http://twitter-stream-globe.herokuapp.com/) (Availability of this server may fluctuate)

Installing and Running
----

Install [Node.js](http://nodejs.org/).

Clone GitHub repo:

```
https://github.com/twitterdev/twitter-stream-globe.git
```

Create a Twitter app and PubNub account:

- Create a [Twitter application](https://apps.twitter.com).
- Create a [PubNub account](https://admin.pubnub.com/#signup) (it's free).

Create a config.json file using config.sample.json as a template. Fill in your Twitter App API and PubNub keys.

Install node module dependencies:

```
npm install 
```

Run application:

```
npm start
```

Go to [http://localhost:3000](http://localhost:3000) in your browser.


Deploying
---
This application is already configured to run on Heroku and can be [deployed with Git](https://devcenter.heroku.com/articles/git).

Before deployment set your Heroku environment [config vars](https://devcenter.heroku.com/articles/config-vars) to mirror config.json.


Resources
----
- [Twitter API statuses/filter stream](https://dev.twitter.com/docs/api/1.1/post/statuses/filter)
- [Twitter REST API Rate Limiting](https://dev.twitter.com/docs/rate-limiting/1.1)
- [AngularJS](https://angularjs.org/)
- [PubNub AngularJS SDK](https://github.com/pubnub/pubnub-angular)
- [Three.js](http://threejs.org/)
