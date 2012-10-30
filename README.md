connect-jade
============

Jade template render helper for connect

Use case:

    $ npm install connect-jade

    // require lib
    var connectJade = require('connect-jade');
    var connect = require('connect');

    // initialize connect app
    connect(
      connectJade({
        root: __dirname + "/views",
        debug: true
      })
    );

    // in routes
    res.render('index', { title: 'Index Page', items: items });