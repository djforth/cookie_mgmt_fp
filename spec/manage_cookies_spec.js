  const _          = require("lodash");
var Cookies_mgmt = require("../src/cookie_mgmt");


function manageSpys(Wired){
  let spy_list = [];

  let addSpy = (name)=>{
    let spy = jasmine.createSpy(name);
    // console.log(Wired, name)
    let revert = Wired.__set__(name, spy);
    spy_list.push({name:name, spy:spy, revert:revert});
  }

  return {
    addSpy:addSpy

    , addMulti:(list)=>{
      _.forEach(list, (item)=>{
        addSpy(item)
      })
    }

    , getSpy:(name)=>{
      let item = _.find(spy_list, (spy)=>{
        return spy.name === name;
      } )
      return (item) ? item.spy : null;
    }

    , revertAll:()=>{
      _.forEach(spy_list, (spy)=>{
        spy.revert();
      });

      spy_list = []
    }
  }
}


describe("Manage Cookies", function() {
  var new_cookie, spyMngmt, spies;
  afterEach(()=>{
    document.cookie = "test=nil;expires=Thu, 01 Jan 1970 00:00:01 GMT"
  })

  describe('when no name is passed', function() {
    beforeEach(()=>{
      spyMngmt = manageSpys(Cookies_mgmt);
      // console.log("GET", Cookies_mgmt.__get__("getCookie"))
      spyMngmt.addMulti(["getCookie"])
      new_cookie = Cookies_mgmt();

    });

    afterEach(()=>{
      spyMngmt.revertAll();
    })

    it('should return null', function() {
      expect(new_cookie).toBeNull();
    });

    it('should not call getCookie', function() {
      let spy = spyMngmt.getSpy("getCookie");
      expect(spy).not.toHaveBeenCalled()
    });
  });

  describe("if no cookie exists", function() {
    let writer
    beforeEach(()=>{
      writer = jasmine.createSpy("writer");
      spyMngmt = manageSpys(Cookies_mgmt);

      spyMngmt.addMulti(["getCookie", "setExpires", "CookieWriter"])
      let spy = spyMngmt.getSpy("CookieWriter");
      spy.and.returnValue(writer)
      new_cookie = Cookies_mgmt("test");

    });

     afterEach(()=>{
      spyMngmt.revertAll();
    })

    it('should create new cookie_mgmt object', function() {
      expect(new_cookie).toBeDefined();
      expect(_.isObject(new_cookie)).toBeTruthy();
    });

    it('should call getCookie', function() {
      let spy = spyMngmt.getSpy("getCookie");
      expect(spy).toHaveBeenCalledWith("test")
    });

    it('should call CookieWriter', function() {
      let spy = spyMngmt.getSpy("CookieWriter");
      expect(spy).toHaveBeenCalledWith("test", "/")
    });



    it('should have a value of undefined', function() {
      expect(new_cookie.getValue()).toBeUndefined();
    });

    it('should set cookie', function() {
      let spy = spyMngmt.getSpy("setExpires");
      spy.and.returnValue("10days")

      new_cookie.createCookie("bar", 10);
      expect(writer).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(10);

      let calls = writer.calls.argsFor(0);

      expect(calls).toContain("bar");
      expect(calls).toContain("10days");
    });

    it('should delete cookie', function() {
      new_cookie.deleteCookie();
      expect(writer).toHaveBeenCalled();
      expect(writer).toHaveBeenCalled();

      let calls = writer.calls.argsFor(0);

      expect(calls).toContain("nil");
      expect(calls).toContain("Thu, 01 Jan 1970 00:00:01 GMT");
    });
  });

  describe('getCookie', function() {
    let getCookie;
    beforeEach(function() {
      getCookie = Cookies_mgmt.__get__("getCookie");

    });

    afterEach(function() {
      document.cookie = "foo=nil;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/"
    });


    it('should return empty string if no cookie', function() {
      expect(getCookie("test")).toEqual("");
    });

    it('should return empty string if cookie name not set', function() {
      document.cookie = "foo=bar; path=/"
      expect(getCookie("test")).toEqual("");
    });

    it('should return value if there is one', function() {
      document.cookie = "test=bar; path=/"
      expect(getCookie("test")).toEqual("bar");
    });
  });

  describe('set expires', function() {
    let setExpires;
    beforeEach(function() {
      setExpires = Cookies_mgmt.__get__("setExpires");

    });

    it('should return null if days not added', function() {
      expect(setExpires()).toBeNull();
    });

    it('should return date string if days added', function() {
      var expire_str = setExpires(1);

      let date = new Date();
      date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));

      expect(expire_str).toEqual(date.toGMTString())
      expect(_.isString(expire_str)).toBeTruthy();

    });
  });

  describe('cookie Writer', function() {
    let CookieWriter, cookieWriter;
    beforeEach(function() {
      CookieWriter = Cookies_mgmt.__get__("CookieWriter");
      cookieWriter = CookieWriter("test", "/")
    });

    it('should return null if no name is passed', function() {
      expect(CookieWriter()).toBeNull()
    });

    it('should return a function', function() {
      expect(_.isFunction(cookieWriter)).toBeTruthy();
    });

    it('should set cookie if no expiry', function() {
      let string = cookieWriter("foo");
      expect(string).toMatch(/test=foo/);
      expect(string).toMatch(/path=\//);
      let st = document.cookie.indexOf("test=foo");
      expect(st).not.toEqual(-1)
    });
  });
});