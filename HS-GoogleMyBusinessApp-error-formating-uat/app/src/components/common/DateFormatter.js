import moment from 'moment';

/**
 * Method that converts an ISO datetime (in UTC)
 * to a relative datetime (ex. 2 weeks ago) in 
 * local time.
 * 
 * @param {String} time 
 * @returns {String} Returns a relative datetime.
 */
export const relativeTime = (time) => moment.utc(time.substring(0, 18), 'YYYY-MM-DDTHH:mm:ss').local().fromNow();