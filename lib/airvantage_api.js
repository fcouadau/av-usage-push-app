// Module imports
var https = require('https');
var url = require('url');
var qs = require('querystring');
var _ = require('underscore');
var bl = require('bl');
var util = require('./util.js');

var log = util.getLogger();

/**
 * Performs an AV API request (using HTTPS) and calls a callback when it's finished.
 *
 * @param av_url - Root URL to use (e.g. 'na.airvantage.net').
 * @param path - Path to append to the root URL (typically '/api/v1/').
 * @param api_path - Path of the API to call (e.g. 'systems').
 * @param method - HTTP methid to use (e.g. 'GET').
 * @param params - Key/value map of URL params. The access token will automatically be appended to it.
 * @param body - Optional request body.
 * @param access_token - OAuth2 token to use.
 * @param headers - Optional headers. Default is 'Content-Type: application/json'.
 * @param callback - Async callback. Profile: callback(err, data).
 */
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

/**
 * Generates an AirVantage token using the Resource Owner Flow. Calls a callback when it's ready.
 *
 * @param av_url - Root URL to use (e.g. 'na.airvantage.net').
 * @param email - Email of the user account performing the request.
 * @param pass - Password of the user account performing the request.
 * @param client_id - AV API client ID.
 * @param client_secret - AV API client secret.
 * @param callback - Async callback. Profile: callback(err, data).
 */
exports.gentoken = function(av_url, email, pass, client_id, client_secret, callback) {
  var params = { grant_type: 'password', username: email, password: pass, client_id: client_id, client_secret: client_secret };
  avep_req(av_url, '/api/oauth/', 'token', 'GET', params, null, null, null, function(err, data) {
    if (err)
      return callback(err);

    return callback(null, data['access_token']);
  });
};

/**
 * Wrapper on the avep_resp function to directly hit '/api/v1'.
 *
 * @see avep_resp.
 */
exports.avep_json = function(av_url, api_path, method, params, body, access_token, headers, callback) {
  return avep_req(av_url, '/api/v1/', api_path, method, params, body, access_token, headers, callback);
}

/**
 * Calls the Import Usages API.
 * 
 * @param av_url - Root URL to use (e.g. 'na.airvantage.net').
 * @param company - UID of the target company.
 * @param csv - CSV content to import.
 * @access_token - OAuth2 access token.
 * @param callback - Async callback. Profile: callback(err, data).
 */
exports.push_usage_data = function(av_url, company, csv, access_token, callback) {
  this.avep_json(
    av_url, 'operations/systems/usages/import', 'POST', { 'company': company }, csv, access_token,
    { 'Content-Type': 'application/octet-stream' },
    function(err, data) {
      if (err)
        return callback(err);

      return callback(null, data);
    }
  );
}