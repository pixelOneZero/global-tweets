tweet-stream-globe
==========

A real-time 3D visualization of Tweets from around the world.

This web app attaches to the Twitter API stream/filter and runs rudimentry sentiment analysis on Tweets with geo data. Tweets are published via PubNub websockets and plotted to a 3D globe.

Inspired by the [Web GL Globe Chrome Experiment](http://www.chromeexperiments.com/globe) and the [PubNub Real-Time WebGL Visualization](http://www.pubnub.com/blog/creating-real-time-webgl-visualizations/).

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

Install [Compass](http://compass-style.org/) Ruby Gem.

```
gem install compass
```

If you do not want Compass support, comment out this line in app.js

```
// app.use(require('node-compass')({mode: 'compress'}));
```


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
This application is ready to run on a free OpenShift or Heroku account.

**Heroku**

You can deploy to Heroku via [Git](https://devcenter.heroku.com/articles/git) with the [Heroku toolbelt](https://toolbelt.heroku.com/).

Before deploying to Heroku, set your environment [config vars](https://devcenter.heroku.com/articles/config-vars) to mirror config.json, and set `NODE_ENV` to "production."

**OpenShift**

You can deploy to OpenShift with [`rhc`](https://github.com/openshift/rhc), by adding your own keys to the following command:

```
rhc app create twglobe nodejs-0.10 \
  --from-code=http://github.com/twitterdev/twitter-stream-globe.git \
  NODE_ENV=production \ 
  TWITTER_CONSUMER_KEY=YOUR_TWITTER_CONSUMER_KEY \
  TWITTER_CONSUMER_SECRET=YOUR_TWITTER_CONSUMER_SECRET \
  TWITTER_ACCESS_TOKEN=YOUR_TWITTER_ACCESS_TOKEN \
  TWITTER_TOKEN_SECRET=YOUR_TWITTER_TOKEN_SECRET \
  PUBNUB_PUBLISH_KEY=YOUR_PUBNUB_PUBLISH_KEY \
  PUBNUB_SUBSCRIBE_KEY=YOUR_PUBNUB_SUBSCRIBE_KEY
```

Resources
----
- [Twitter API statuses/filter stream](https://dev.twitter.com/docs/api/1.1/post/statuses/filter)
- [Twitter REST API Rate Limiting](https://dev.twitter.com/docs/rate-limiting/1.1)
- [AngularJS](https://angularjs.org/)
- [PubNub AngularJS SDK](https://github.com/pubnub/pubnub-angular)
- [Three.js](http://threejs.org/)
