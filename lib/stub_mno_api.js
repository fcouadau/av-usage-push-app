var util = require('./util.js')

var log = util.getLogger();
var CSV_HEADER = 'SUBSCRIPTION[IDENTIFIER],TYPE,TIMESTAMP,DURATION,BYTES_SENT,BYTES_RECEIVED'

/*
 * Generates random usage data records.
 */
function generate_lines(ts, number) {
  lines = '';
  for (var i = 0; i < number; i++) {
    lines += '8933209514015284725,DATA,'+(ts-i*1000)+','+Math.floor(Math.random()*1440)+','+Math.floor(Math.random()*32768)+','+Math.floor(Math.random()*32768)+'\n';
  }

  return lines;
}

exports.extract_usages = function(timestamp, callback) {
  var ts = String(Math.round(new Date().getTime() / 1000));
  var nb_lines = 10;
  var csv = CSV_HEADER + '\n' + generate_lines(ts, nb_lines);
  log.debug('Generated CSV:\n%s', csv);
  return callback(null, ts, csv, nb_lines, true);
}