
import _ from 'lodash';
import Cookies_mgmt from '../src/cookie_mgmt';
import SpyManager from '@djforth/stubs-spy-manager-jest';

describe("Manage Cookies", ()=>{
  var new_cookie, spyMngmt, spies;
  const spies_stubs = SpyManager(Cookies_mgmt);
  afterEach(()=>{
    document.cookie = "test=nil;expires=Thu, 01 Jan 1970 00:00:01 GMT"
  });

  afterEach(()=>{
    spies_stubs.clear();
  });

  describe('when no name is passed', ()=>{

    beforeEach(()=>{
      spies_stubs.add([
        {
          stub: 'getCookie'
        }
      ]);
      spies_stubs.make();
      new_cookie = Cookies_mgmt();
    });

    test('should return null', ()=>{
      expect(new_cookie).toBeNull();
    });

    test('should not call getCookie', ()=>{
      let spy = spies_stubs.get("getCookie");
      expect(spy).not.toHaveBeenCalled()
    });
  });

  describe("if no cookie exists", ()=>{
    let writer
    beforeEach(()=>{
      spies_stubs.add([
        {
          spy: 'writer'
        }
        , {
          stub: 'getCookie'
        }
        , {
          stub: 'setExpires'
          , callback: '10days'
        }
        , {
          stub: 'CookieWriter'
          , spy: 'writer'
        }
      ]);
      spies_stubs.make();
      // writer = jasmine.createSpy("writer");
      // spyMngmt = manageSpys(Cookies_mgmt);

      // spyMngmt.addMulti(["getCookie", "setExpires", "CookieWriter"])
      // let spy = spies_stubs.get("CookieWriter");
      // spy.and.returnValue(writer)
      new_cookie = Cookies_mgmt("test");

    });

    test('should create new cookie_mgmt object', ()=>{
      expect(new_cookie).toBeDefined();
      expect(_.isObject(new_cookie)).toBeTruthy();
    });

    test('should call getCookie', ()=>{
      let spy = spies_stubs.get("getCookie");
      expect(spy).toHaveBeenCalledWith("test")
    });

    test('should call CookieWriter', ()=>{
      let spy = spies_stubs.get("CookieWriter");
      expect(spy).toHaveBeenCalledWith("test", "/")
    });

    test('should have a value of undefined', ()=>{
      expect(new_cookie.getValue()).toBeUndefined();
    });

    test('should set cookie', ()=>{
      let spy = spies_stubs.get("setExpires");
      writer = spies_stubs.get("writer");

      new_cookie.createCookie("bar", 10);
      expect(writer).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(10);
      let calls = writer.mock.calls[0];
      expect(calls).toContain("bar");
      expect(calls).toContain("10days");
    });

    test('should delete cookie', ()=>{
      new_cookie.deleteCookie();
      writer = spies_stubs.get("writer");
      expect(writer).toHaveBeenCalled();
      expect(writer).toHaveBeenCalled();

      let calls = writer.mock.calls[0];

      expect(calls).toContain("nil");
      expect(calls).toContain("Thu, 01 Jan 1970 00:00:01 GMT");
    });
  });

  describe('getCookie', ()=>{
    let getCookie;
    beforeEach(()=>{
      getCookie = spies_stubs.getFn("getCookie");
    });

    afterEach(()=>{
      document.cookie = "foo=nil;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/"
    });


    test('should return empty string if no cookie', ()=>{
      expect(getCookie("test")).toEqual("");
    });

    test('should return empty string if cookie name not set', ()=>{
      document.cookie = "foo=bar; path=/"
      expect(getCookie("test")).toEqual("");
    });

    test('should return value if there is one', ()=>{
      document.cookie = "test=bar; path=/"
      expect(getCookie("test")).toEqual("bar");
    });
  });

  describe('set expires', ()=>{
    let setExpires;
    beforeEach(()=>{
      setExpires = spies_stubs.getFn("setExpires");

    });

    test('should return null if days not added', ()=>{
      expect(setExpires()).toBeNull();
    });

    test('should return date string if days added', ()=>{
      var expire_str = setExpires(1);

      let date = new Date();
      date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));

      expect(expire_str).toEqual(date.toGMTString())
      expect(expire_str).toBeString();

    });
  });

  describe('cookie Writer', ()=>{
    let CookieWriter, cookieWriter;
    beforeEach(()=>{
      CookieWriter = spies_stubs.getFn("CookieWriter");
      cookieWriter = CookieWriter("test", "/")
    });

    test('should return null if no name is passed', ()=>{
      expect(CookieWriter()).toBeNull()
    });

    test('should return a function', ()=>{
      expect(cookieWriter).toBeFunction();
    });

    test('should set cookie if no expiry', ()=>{
      let string = cookieWriter("foo");
      expect(string).toMatch(/test=foo/);
      expect(string).toMatch(/path=\//);
      let st = document.cookie.indexOf("test=foo");
      expect(st).not.toEqual(-1)
    });
  });
});