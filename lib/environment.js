// Generated by CoffeeScript 1.10.0
(function() {
  var fs, xml2js;

  fs = require('fs');

  xml2js = require('xml2js');

  exports.url = function(env, callback) {
    var parser;
    if (env == null) {
      env = 'DEV';
    }
    parser = new xml2js.Parser;
    fs.readFile('.\\Utilities\\envs.xml', function(err, data) {
      if (err) {
        throw err;
      }
      parser.parseString(data, function(err, result) {
        var url, xmlnode;
        if (err) {
          throw err;
        }
        xmlnode = result.Settings[env];
        url = xmlnode != null ? xmlnode[0].$.URL : void 0;
        if (url) {
          callback(url);
        } else {
          throw new TypeError('Invalid environment parameter or value. Usage: envName=DEV');
        }
      });
    });
  };

}).call(this);
