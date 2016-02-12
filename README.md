# Cookie Management

A small utility for managing cookies in the browser

[![Build Status](https://semaphoreci.com/api/v1/djforth/cookie_mgmt_fp/branches/master/badge.svg)](https://semaphoreci.com/djforth/cookie_mgmt_fp)

## Install

```bash

npm install @djforth/cookie_mgmt_fp --save

```

## Usage

Setup up and instance:

```javascript
var CookieMgmt = require("@djforth/cookie_mgmt_fp");

var mycookie = CookieMgmt("my-cookie");

```

This will return a object with the following methods:

### createCookie (Value, Days):

This will create the cookie "my-cookie" with a value of "foobar" and it will expire in 31 days

```javascript
mycookie.createCookie("foobar", 31)
```
### getValue

The cookie is read once the manage is instantiated, :
```javascript
mycookie.getValue() //returns foobar
```

### deleteCookie

This will delete the cookie:
```javascript
mycookie.deleteCookie()
```

# Bug reports

If you discover any bugs, feel free to create an issue on GitHub. Please add as much information as possible to help us fixing the possible bug. We also encourage you to help even more by forking and sending us a pull request.

https://github.com/djforth/cookie_mgmt_fp/issues

## Contribute

If you'd like to contribute, cookie_mgmt_fp is written using babel in ES6.

Please make sure any additional code should be covered in tests (Jasmine using karma).

If you need to run the test please use:

``` bash

npm test

```

or to rebuild the JS run:

``` bash

npm run build

```

## Maintainers

Adrian Stainforth (https://github.com/djforth)

# License

cookie_mgmt_fp is an open source project falling under the MIT License. By using, distributing, or contributing to this project, you accept and agree that all code within the cookie_mgmt_fp project are licensed under MIT license.








