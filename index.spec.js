'use strict';

// Copy of _htmlBoiler from index.js, ensures typos are not added
var _htmlBoiler = '';
_htmlBoiler += '<span class="svgContainer">';
_htmlBoiler += '  <svg version="1.1" xmlns="http://www.w3.org/2000/svg">';
_htmlBoiler += '    <defs id="palettes"></defs>';
_htmlBoiler += '    <defs id="templates"></defs>';
_htmlBoiler += '    <g id="objects">';
_htmlBoiler += '      <!-- todo: test place holder -->';
_htmlBoiler += '      <use id="oobject1" xlink:href="#ttemplatelistitem1" x="5" y="5" width="10" height="20"/>';
_htmlBoiler += '    </g>';
_htmlBoiler += '  </svg>';

_htmlBoiler += '  <style>';
_htmlBoiler += '    .svgContainer {';
_htmlBoiler += '      -webkit-touch-callout: none !important;';
_htmlBoiler += '      -webkit-user-select: none !important;';
_htmlBoiler += '      -khtml-user-select: none !important;';
_htmlBoiler += '      -moz-user-select: none !important;';
_htmlBoiler += '      -ms-user-select: none !important;';
_htmlBoiler += '      user-select: none !important;';
_htmlBoiler += '    }';
_htmlBoiler += '    .svgContainer svg:not([width]) {';
_htmlBoiler += '      width: 100% !important;';
_htmlBoiler += '    }';
_htmlBoiler += '  </style>';
_htmlBoiler += '</span>';

describe('vectic()', function () {
  var vecticObj, vecticTargetMock, vecticParamsMock, firebaseLibMock, firebaseLibMockObj;

  beforeEach(function() {
    // Reset variables for each test
    vecticObj = null;

    // Mocks
    vecticTargetMock = {
      html: function() {}
    };

    vecticParamsMock = {
      target: vecticTargetMock,
      vecticID: 'vectic1',
    };

    firebaseLibMockObj = {
      on: function() {},
      once: function() {},
    };
    firebaseLibMock = function() {
      return firebaseLibMockObj;
    };

    // Global Spies
    spyOn(vecticTargetMock, 'html');
    spyOn(firebaseLibMockObj, 'on');
    spyOn(firebaseLibMockObj, 'once');
  });

  // Initiation Tests
  it('should generate uid', function() {
    var vecticObj  = new vectic(vecticParamsMock);
    expect(vecticObj.rootID).toEqual('vvectic1_id1');
  });
  it('should generate new unique uid for each new vectic', function() {
    var vecticObj  = new vectic(vecticParamsMock);
    expect(vecticObj.rootID).toEqual('vvectic1_id2');
  });
  it('should exit and fail if target is missing', function() {
    var vecticObj  = new vectic({
      vecticID: 'vectic1',
    });
    expect(vecticObj.rootID).toEqual(undefined);
  });
  it('should exit and fail if vecticID is missing', function() {
    var vecticObj = new vectic({
      target: vecticTargetMock,
    });
    expect(vecticObj.rootID).toEqual(undefined);
  });

  describe('function', function() {
    var vecticObj;
    beforeEach(function() {
      vecticObj = new vectic(vecticParamsMock);
      vecticObj.firebaseLib = firebaseLibMock;
      spyOn(vecticObj, 'initHTML');
      spyOn(vecticObj, 'initFirebase');
      spyOn(vecticObj, 'firebaseLib');
    });

    describe('on creation', function() {
      it('should not populate inner html()', function() {
        expect(vecticTargetMock.html).not.toHaveBeenCalled();
      });
    });

    describe('init()', function() {
      it('should trigger initHTML()', function() {
        vecticObj.init();
        expect(vecticObj.initHTML).toHaveBeenCalled();
      });
      it('should trigger initFirebase()', function() {
        vecticObj.init();
        expect(vecticObj.initFirebase).toHaveBeenCalled();
      });
    });

    describe('initHTML()', function() {
      it('should populate html boiler content on target', function() {
        vecticObj.initHTML.and.callThrough();
        vecticObj.initHTML();
        expect(vecticTargetMock.html).toHaveBeenCalledWith(_htmlBoiler);
      })
    });

    describe('initFirebase()', function() {
      it('should populate html boiler content on target', function() {
        vecticObj.initFirebase.and.callThrough();
        vecticObj.initFirebase();
        expect(vecticObj.firebaseLib).toHaveBeenCalled();
      })
    });
  });

  


  /*var vecticObj;
  
  // Init vectic
  beforeEach(function() {
    vecticObj  = new vectic(vecticParamsMock);
  });*/

  
});
