// Module dependencies
var config = require('config');
var sched = require('node-schedule');
var util = require('./lib/util.js');
var av_api = require('./lib/airvantage_api');
var mno_api = require('./lib/' + config.get('mno.implementation'));

var log = util.getLogger();
var av_token = null;
var last_successful_timestamp = null;

/*
 * Generates an AirVantage authentication token and schedules its cyclic re-generation.
 */
function gen_av_token(callback) {
  log.info('Generating AirVantage access token');
  av_api.gentoken(config.get('airvantage.av_url'), config.get('airvantage.email'), config.get('airvantage.pass'), config.get('airvantage.client_id'), config.get('airvantage.client_secret'), function(err, token) {
    if (err)
      return log.error('Authentication failed: %s', err);

    // Store token
    this.av_token = token;

    // Schedule token re-generation in 12 hours
    setTimeout(gen_av_token, 12 * 60 * 60 * 1000);

    if (callback) callback();
  });
}

/*
 * Schedules read_push_cycle to be executed
 * @param now - if true, the cycle will be immediately executed.
 * @param cust_message - custom message to be displayed in the logs before the standard output.
 */
function schedule_read_push(now, cust_message) {
  var interval = (now ? 0 : config.get('read_push_interval'))
  log.info((cust_message ? cust_message + ' - ' : '') + 'Scheduling next read/push cycle in %s minute(s)', interval);
  return setTimeout(read_push_cycle, interval * 60000);
}

/*
 * Reads data from the MNO's systems and pushes it into AirVantage
 */
function read_push_cycle() {
  log.info('Starting read/push cycle')
  // Extract usages from the MNO's platform
  mno_api.extract_usages(this.last_successful_timestamp, function(err, timestamp, data, records, finished) {
    if(err) {
      log.error('Error extracting records: ' + err);
      schedule_read_push();
    }

    log.info('%s records extracted (finished: %s), most recent timestamp is %s', records, finished, timestamp);

    // Push data into AirVantage
    if (records > 0) {
      av_api.push_usage_data(config.get('airvantage.av_url'), config.get('airvantage.company'), data, this.av_token, function(err, data) {
        if(err) {
          log.error('Error pushing usage data into AirVantage: %s', err);
        } else {
          log.info('%s records pushed successfully. Operation UID: %s', records, data['operation']);
          last_successful_timestamp = timestamp;
        }

        // Schedule next push cycle
        if (finished) {
          schedule_read_push();
        } else {
          schedule_read_push(true, 'More usage data are pending');
        }
      });
    }
  });
}

log.info('*******************************');
log.info('Starting Usage push application');
log.info('Using MNO API: %s', JSON.stringify(config.get('mno.implementation'), null, 2));
log.info('*******************************');

// Log into AirVantage
gen_av_token(function() {
  // Retrieve last successful timestamp
  this.last_successful_timestamp = new Date().getTime(); // TODO retrieve from a database / conf. file

  // Initiate first read/push cycle
  schedule_read_push(true, 'Startup complete');
});