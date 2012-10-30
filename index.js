/*!
 * connect-jade
 * Copyright(c) 2012 yitsushi <yitsushi@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path');
var http = require('http');
var jade = require('jade');

var settings = {
  root: __dirname + '/views',
  layout: 'layout.html',
  debug: true
};

var cache = {};

/**
 * Render the view fill with locals
 *
 * @param  {String} path    view name.
 * @param  {Object} [locals=null]
 */
function render(path, locals) {
  var res = this;
  if (typeof locals == "undefined") {
    locals = settings.defaults;
  } else {
    for (var k in settings.defaults) {
      if (!locals.hasOwnProperty(k)) {
        locals[k] = settings.defaults[k];
      }
    }
  }
  path = settings.root + "/" + path + ".jade";

  try {
    fs.realpathSync(path);
  } catch (e) {
    // if file doesn't not exist then send 404 error
    // TODO: settings.errorpages.404
    res.writeHead(404);
    return res.end("404 - not found");
  }

  // if debug is enabled check cache for view content
  if (!settings.debug && cache.hasOwnProperty(path)) {
    var jadeContent = jade.compile(cache[path], {filename: path});
    var html = jadeContent(locals);
    res.write(html);
    return res.end();
  }

  // read view content
  fs.readFile(path, function readViewFile(err, data) {
    if (err) {
      if (settings.debug) {
        console.log(err);
      }
      // if there was any error then send an 500 error
      // TODO: settings.errorpages.500
      res.writeHead(500);
      return res.end("500 - internal server error");
    }

    res.writeHead(200, { "Content-Type": "text/html" });

    // cache view content
    cache[path] = data;

    // call jade compiler and render output html
    var jadeContent = jade.compile(data, {filename: path});
    var html = jadeContent(locals);

    // send rendered html to the client
    res.write(html);
    return res.end();
  });

  return this;
}

/**
 * connect-jade: Template Render helper for connect
 *
 * Use case:
 *
 * var connectJade = require('./lib/connect-jade');
 * var connect = require('connect');
 *
 * connect(
 *   connectJade({
 *     root: __dirname + "/views",
 *     debug: true
 *   })
 * );
 *
 * res.render('index', { title: 'Index Page', items: items });
 *
 * @param {Object} [options={}] render options.
 * @return {Function} render middleware for `connect`
 */
module.exports = function (options) {
  options = options || {};
  for (var k in options) {
    settings[k] = options[k];
  }
  return function (req, res, next) {
    req.next = next;
    if (!res.req) {
      res.req = req;
    }
    res.render = render;
    return next();
  };
};