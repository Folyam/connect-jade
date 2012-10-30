connect-jade
============

Jade template render helper for connect

Use case
--------

    $ npm install connect-jade

    // require lib
    var connectJade = require('connect-jade');
    var connect = require('connect');

    // initialize connect app
    connect(
      connectJade({
        root: __dirname + "/views",
        debug: true,
        defaults: {
          title: "No title"
          keywords: "node, connect, jade, template"
        }
      })
    );

    // in routes
    res.render('index', { title: 'Index Page', items: items });

Test
------

**Self:**

    git clone https://github.com/Yitsushi/connect-jade.git
    cd connect-jade
    npm test

**Travis:** https://travis-ci.org/#!/Yitsushi/connect-jade