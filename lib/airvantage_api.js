// Module imports
var https = require('https');
var url = require('url');
var qs = require('querystring');
var _ = require('underscore');
var bl = require('bl');
var util = require('./util.js');

var log = util.getLogger();

function avep_req(av_url, path, api_path, method, params, body, access_token, headers, callback) {
  var options = {
    protocol: 'https:',
    method: method || 'GET',
    slashes: true,
    hostname: av_url,
    path: path + api_path + '?' + qs.stringify(_.extend(params || {}, { 'access_token': access_token })),
    headers: headers || { 'Content-Type': 'application/json' }
  };
  log.debug('HTTP/' + options['method'] + ' on ' + url.format(options) + options.path);

  var req = https.request(options, function(res) {
    res.pipe(bl(function (err, data){
      if(err)
        return callback(err);

      log.debug('HTTP ' + res.statusCode);

      if(res.statusCode != 200) {
        // HTTP error code
        return callback(data.toString());
      } else {
        try {
          // Parse & return JSON content
          var json = JSON.parse(data);
          return callback(null, json);
        } catch (e) {
          // Unparseable JSON content
          return callback(e);
        }
      }
    }));
  });

  if (body != null && typeof body !== 'undefined') {
    req.write(body);
  }

  req.end();
};

exports.gentoken = function(av_url, email, pass, client_id, client_secret, callback) {
  var params = { grant_type: 'password', username: email, password: pass, client_id: client_id, client_secret: client_secret };
  avep_req(av_url, '/api/oauth/', 'token', 'GET', params, null, null, null, function(err, data) {
    if (err)
      return callback(err)

    return callback(null, data['access_token'])
  });
};

exports.avep_json = function(av_url, api_path, method, params, body, access_token, headers, callback) {
  return avep_req(av_url, '/api/v1/', api_path, method, params, body, access_token, headers, callback);
}

exports.push_usage_data = function(av_url, company, csv, access_token, callback) {
  this.avep_json(
    av_url, 'operations/systems/usages/import', 'POST', { 'company': company }, csv, access_token,
    { 'Content-Type': 'application/octet-stream' },
    function(err, data) {
      if (err)
        return callback(err)

      return callback(null, data)
    }
  );
}