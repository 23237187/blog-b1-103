/**
 * Created by log on 14-1-16.
 */
var config = require('../config/config.js'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db(config.db, new Server(config.host, Connection.DEFAULT_PORT, {}), {safe: true});
