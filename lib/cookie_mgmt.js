"use strict";

var _ = require("lodash");
/**
 * Cookie Managemnet module.
 * @module @djforth/cookie_mgmt_fp
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

function setExpires(days) {
  if (!days) return null;

  var date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  return date.toGMTString();
}

function CookieWriter(name, path) {
  if (!name) return null;
  return function (v, exp) {
    var cookie_str = name + "=" + v + ";";
    if (exp) {
      cooke_str += " expires=" + exp + ";";
    }
    cookie_str += " path=" + path;
    document.cookie = cookie_str;

    return cookie_str;
  };
}
/**
 * Cookie Management
 * Will default try to read cookie of passed name
 * Will return an object
 * @param {string} Name  - Name of cookie variable.
 * @param {string} path - Default path will default /
.
 */
function CookieManagment(name) {
  var path = arguments.length <= 1 || arguments[1] === undefined ? "/" : arguments[1];

  if (_.isUndefined(name)) return null;

  var cookie_val = getCookie(name);

  var cookieWriter = CookieWriter(name, path);

  /**
  * This will add or create a new cookie value
  * @param {string} Value (required) - value you wish to set the cookie.
  * @param {number} Days (optional)- The number of Days till the cookie will expire
  .
  * @inner
  */
  function createCookie(v, d) {
    cookie_val = v;
    cookieWriter(v, setExpires(d));
  }
  /** This will distroy the cookie
  * @inner
  */
  function deleteCookie() {
    cookieWriter("nil", "Thu, 01 Jan 1970 00:00:01 GMT");
  }
  /** Return the value of the cookie
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
//# sourceMappingURL=cookie_mgmt.js.map