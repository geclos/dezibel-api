[![Build Status](https://travis-ci.org/geclos/dezibel-api.svg?branch=master)](https://travis-ci.org/geclos/dezibel-api)
![Dependencies status](https://david-dm.org/geclos/dezibel-api.svg)
[![Code Climate](https://codeclimate.com/repos/57c5af4f15391043d3000197/badges/3301087a120971e3e2e5/gpa.svg)](https://codeclimate.com/repos/57c5af4f15391043d3000197/feed)
[![Coverage Status](https://coveralls.io/repos/github/geclos/dezibel-api/badge.svg?branch=master)](https://coveralls.io/github/geclos/dezibel-api?branch=master)

#Dezible API
Back-end service for a small *airbnb-like* app I'm developing.

##TL;DR

You can do whatever you want with the code. For example: it can easily be stripped down to an auth API layer with Oauth support for any kind of service.

##Motivation

It is an app aimed at music bands, live-music venues and fans. Venues can create events and hire bands through the app whereas fans can search for nearby events, comment on past events and check in to upcoming events.

Currently the back-end supports:

1. CRUD of users stored in a Redis SaaS.
2. Oauth support through facebook.
3. CRUD of events stored in a mongoDB SaaS.
4. CRUD of offers (contract offers from venus to bands tied to a specific event) stored in mongoDB.
5. Geolocation queries to get nearby events.

Tech stack:

1. HapiJS
2. AvaJS
3. tracis CI
4. heroku

I try to maintain the project healthy with a set of unit tests, Travis CI, and greenkeeper integration to manage dependency updates.

Enjoy!
G.