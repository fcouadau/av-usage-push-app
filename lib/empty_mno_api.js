
var AV_CSV_HEADER = 'SUBSCRIPTION[IDENTIFIER],TYPE,TIMESTAMP,DURATION,BYTES_SENT,BYTES_RECEIVED' // Optional columns: BYTES_TOTAL,SESSION_ID

/**
 * Extracts usages from the MNO's systems and calls an async callback with an AirVantage-compatible CSV.
 * @see https://na.airvantage.net/develop/apiDocumentation/apiDocumentation?page=API+-+System+v1.html#API-Systemv1-ImportUsages
 *
 * @param timestamp - Timestamp of oldest usage record to request.
 * @param callback - Async callback. Profile is: callback(error, new_ts, csv, nb_lines, finished).
 *    - error: error message, or null if successful.
 *    - new_ts: timestamp of latest extracted usage record.
 *    - csv: AirVantage-compatible CSV (including AV_CSV_HEADER above).
 *    - nb_lines: Number of extracted records.
 *    - finished: true if no more records are pending (i.e. we're up-to-date with the MNO). false otherwise.
 */
exports.extract_usages = function(timestamp, callback) {
  // TODO: YOUR IMPLEMENTATION HERE. See stub_mno_api.js for a simple example.
}