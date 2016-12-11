var path = require("path");
var express = require("express");
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var compression = require("compression")
var _ = require("lodash")
var SearchkitExpress = require("searchkit-express")





module.exports = {
  start: function(prodMode) {

    var env = {
      production: process.env.NODE_ENV === 'production'
    };

    var express = require('express');
    var app = express();
    app.use(compression())
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(methodOverride())

    var port = Number(process.env.PORT || 3000);

    if (!env.production) {
      var webpack = require("webpack");
      var webpackMiddleware = require("webpack-dev-middleware");
      var webpackHotMiddleware = require('webpack-hot-middleware');
      var config = require("../webpack.dev.config.js");
      var compiler = webpack(config);

      app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          modules: false
        }
      }));

    
//...

    SearchkitExpress({
      // For HTTP basic auth use format: "http://username:password@localhost:9200" in host parameter
      host:process.env.ELASTIC_URL || "http://elasticsearch:9200", 
      index:'firebase',
      queryProcessor:function(query, req, res){
        //do neccessery permissions, prefilters to query object
        //then return it
        return query
      }
     }, app)

      app.use(webpackHotMiddleware(compiler));


    } else {
      app.use("/static", express.static(__dirname + '/dist'));
    }

    app.get('*', function(req, res) {
      res.render('index');
    });

    app.listen(port, function () {
      console.log('server running at localhost:3000, go refresh and see magic');
    });
  }
}
