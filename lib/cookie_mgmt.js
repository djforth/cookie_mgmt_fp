"use strict";

var _ = require("lodash");

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

module.exports = function (name) {
  var path = arguments.length <= 1 || arguments[1] === undefined ? "/" : arguments[1];

  if (_.isUndefined(name)) return null;

  var cookie_val = getCookie(name);

  var cookieWriter = CookieWriter(name, path);

  return {
    createCookie: function createCookie(v, d) {
      cookieWriter(v, setExpires(d));
    },
    deleteCookie: function deleteCookie() {
      cookieWriter("nil", "Thu, 01 Jan 1970 00:00:01 GMT");
    },
    getValue: function getValue() {
      return cookie_val;
    }

  };
};
//# sourceMappingURL=cookie_mgmt.js.map