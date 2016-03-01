"use strict";

var _ = require("lodash/core");

/**
 * Cookie Management module.
 * @module @djforth/cookie_mgmt_fp
*/

/**
 * getCookie
 * Will read cookie value of passed name
 * Will return an string
 *
 * type {function}
 * @param {string} name  - Name of cookie variable.
 * @return {string} returns cookie value
 * @inner
 */
function getCookie(name) {
  // no cookie set
  if (document.cookie.length <= 0) return "";
  // Start of required cookie
  var st = document.cookie.indexOf(name + "=");
  // If cookie not set
  if (st === -1) return "";
  // Gets value
  st = st + name.length + 1;
  var end = document.cookie.indexOf(";", st);
  end = end === -1 ? document.cookie.length : end;

  return unescape(document.cookie.substring(st, end));
}

/**
 * Sets expiry
 * Will create expiry based on number of days from todays date.  Will return null if nothing passed
 *
 * type {function}
 * @param {number} days  - Number of days till cookie will expire.
 * @return {string} returns expire value
 * @inner
 */
function setExpires(days) {
  if (!days) return null;

  var date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  return date.toGMTString();
}

/**
 * Creates Cookie Writer
 * Creates a cookie write function
 *
 * type {function}
 * @param {number} name - name of cookie
 * @param {string} path - domain path of cookie
 * @return {function} returns function to create/write cookie
 * @inner
 */
function CookieWriter(name, path) {
  if (!name) return null;
  return function (v, exp) {
    var cookie_str = name + "=" + v + ";";
    if (exp) {
      cookie_str += " expires=" + exp + ";";
    }
    cookie_str += " path=" + path;
    document.cookie = cookie_str;

    return cookie_str;
  };
}

/**
 * Create a Cookie Management
 * Will default try to read cookie of passed name
 * Will return an object
 *
 * type {function}
 * @param {string} name  - Name of cookie variable.
 * @param {string} path - Default path will default /
 * @return {object} returns object of functions
 * @name CookieManagment
 * @namespace CookieManagment
 */
function CookieManagment(name) {
  var path = arguments.length <= 1 || arguments[1] === undefined ? "/" : arguments[1];

  if (_.isUndefined(name)) return null;

  var cookie_val = getCookie(name);

  var cookieWriter = CookieWriter(name, path);

  /** This will add or create a new cookie value
    *
    * type {function}
    * @param {string} value - value you wish to set the cookie.
    * @param {number} days - The number of Days till the cookie will expire
    * @inner */
  function createCookie(value, days) {
    cookie_val = value;
    cookieWriter(value, setExpires(days));
  }
  /** This will destroy the cookie
  * type {function}
  * @inner */
  function deleteCookie() {
    cookieWriter("nil", "Thu, 01 Jan 1970 00:00:01 GMT");
  }
  /** Return the value of the cookie
  * @return {string} returns value of cookie
  * @inner */
  function getValue() {
    return cookie_val;
  }

  return {
    createCookie: createCookie,
    deleteCookie: deleteCookie,
    getValue: getValue
  };
}

module.exports = CookieManagment;