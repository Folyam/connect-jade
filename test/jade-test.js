var Connect       = require('connect'),
    connectJade   = require('../index'),
    Request       = require('./support/http').Request,
    should        = require('should'),
    UrlRouter     = require('urlrouter');

var router = UrlRouter(function Application(app) {
  var data = {
    data: {
      _id: "28a4e331b5e1dbe2f5264304b9bd8cb7",
      name: "test content"
    }
  };
  app.get("/",  function root(req, res) {
    res.end("root");
  });

  app.get("/extends-with-title", function extendsWithTitle(req, res) {
    data.title = "Got title";
    res.render("test/extends_with_title", data);
  });

  app.get("/extends-without-title", function extendsWithTitle(req, res) {
    if (typeof data.title != "undefined") {
      delete data.title;
    }
    res.render("test/extends_without_title", data);
  });

  app.get("/raw", function extendsWithTitle(req, res) {
    res.render("test/raw", data);
  });
});

var app = Connect();
app.use(connectJade({
  root: __dirname + "/views",
  debug: true,
  defaults: {
    title: "No title"
  }
}));
app.use(router);

function testServer (name, fn) {
  test(name, function (done) {
    var request = new Request(app);
    fn(request);
    request.end(done);
  });
}

suite("connect-jade", function() {
  test("use connect with / path", function(done) {
    var request = new Request(app);
    request.get('/', function (res) {
      res.body.should.match(/root/);
    });
    request.end(done);
  });

  test("should render jade with extends and title from parameters", function(done) {
    var request = new Request(app);
    request.get('/extends-with-title', function (res) {
      res.body.should.match(/meta description/);
      res.body.should.match(/block keywords/);
      res.body.should.match(/<h1>28a4e331b5e1dbe2f5264304b9bd8cb7<\/h1>/);
      res.body.should.match(/<p>test content<\/p>/);
    });
    request.end(done);
  });

  test("should render jade with extends and default title", function(done) {
    var request = new Request(app);
    request.get('/extends-without-title', function (res) {
      res.body.should.match(/meta description/);
      res.body.should.match(/block keywords/);
      res.body.should.match(/<title>No title<\/title>/);
      res.body.should.match(/<h1>28a4e331b5e1dbe2f5264304b9bd8cb7<\/h1>/);
      res.body.should.match(/<p>test content<\/p>/);
    });
    request.end(done);
  });

  test("should render jade", function(done) {
    var request = new Request(app);
    request.get('/raw', function (res) {
      res.body.should.match(/<h1>28a4e331b5e1dbe2f5264304b9bd8cb7<\/h1>/);
      res.body.should.match(/<p>test content<\/p>/);
    });
    request.end(done);
  });
});
