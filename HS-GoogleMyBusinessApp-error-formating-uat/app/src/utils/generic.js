/**
 * Method that checks the current page for open inputs.
 * 
 * @param {String} className 
 * @returns {Boolean} Returns whether all the inputs are closed or not.
 */
export const areAllInputsClosed = (className) => [...document.getElementsByClassName(className)].reduce((total, input) => input.value.length ? ++total : total, 0) === 0

/**
 * Method that validates that the input is a truthy value.
 * 
 * @param {String | Number} value 
 * @returns {String} Returns an error if the input is falsy.
 */
export const required = (value) => (value ? undefined : 'Required');

/**
 * Method that validates that the input is an array with length.
 * 
 * @param {String | Number} value 
 * @returns {String} Returns an error if the input an empty array.
 */
export const requiredArray = (value) => (value && value.length ? undefined : 'Required');

/**
 * Method that capitalizes the first letter of the given string.
 * 
 * @param {String} value 
 * @returns {String} Returns a capitalized string.
 */
export const capitalize = (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;