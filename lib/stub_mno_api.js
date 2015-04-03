var util = require('./util.js')

var log = util.getLogger();
var AV_CSV_HEADER = 'SUBSCRIPTION[IDENTIFIER],TYPE,TIMESTAMP,DURATION,BYTES_SENT,BYTES_RECEIVED'

/**
 * Extracts usages from the MNO's systems, and returns an AirVantage-compatible CSV.
 * @see https://na.airvantage.net/develop/apiDocumentation/apiDocumentation?page=API+-+System+v1.html#API-Systemv1-ImportUsages
 *
 * @param timestamp - Timestamp of oldest usage record to request.
 * @param callback - Async callback. Profile is: callback(error, new_ts, csv, nb_lines, finished).
 *    - error: error message, or null if successful.
 *    - new_ts: timestamp of latest extracted usage record.
 *    - csv: AirVantage-compatible CSV.
 *    - nb_lines: Number of extracted records.
 *    - finished: true if no more records are pending (i.e. we're up-to-date with the MNO). false otherwise.
 */
exports.extract_usages = function(timestamp, callback) {
  var ts = String(Math.round(new Date().getTime()));
  var nb_lines = 10;
  var csv = AV_CSV_HEADER + '\n' + generate_lines(ts, nb_lines);
  log.debug('Generated CSV:\n%s', csv);
  return callback(null, ts, csv, nb_lines, true);
}

/*
 * Generates random usage data records.
 */
function generate_lines(ts, number) {
  var lines = '';
  for (var i = 0; i < number; i++) {
    lines += '8933209514015284725,DATA,'+(ts-i*1000)+','+Math.floor(Math.random()*1440)+','+Math.floor(Math.random()*32768)+','+Math.floor(Math.random()*32768)+'\n';
  }

  return lines;
}
