'use strict';

var config 		= require('./config');

var dbURI = "mongodb://" + 
            config.db.host + ":" + 
            config.db.port + "/" 
            //config.db.name;

module.exports = {
    url : dbURI
  };