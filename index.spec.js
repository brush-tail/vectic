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
      child: function() {},
      off: function() {},
      on: function() {},
      once: function() {},
    };
    firebaseLibMock = function() {
      return firebaseLibMockObj;
    };

    // Global Spies
    spyOn(vecticTargetMock, 'html');
    spyOn(firebaseLibMockObj, 'child');
    spyOn(firebaseLibMockObj, 'on');
    spyOn(firebaseLibMockObj, 'off');
    spyOn(firebaseLibMockObj, 'once');
  });

  // Initiation Tests
  it('should generate uid', function() {
    vecticObj = new vectic(vecticParamsMock);
    expect(vecticObj.rootID).toEqual('vvectic1_id1');
  });
  it('should generate new unique uid for each new vectic', function() {
    vecticObj = new vectic(vecticParamsMock);
    expect(vecticObj.rootID).toEqual('vvectic1_id2');
  });
  it('should exit and fail if target is missing', function() {
    vecticObj = new vectic({
      vecticID: 'vectic1',
    });
    expect(vecticObj.rootID).toEqual(undefined);
  });
  it('should exit and fail if vecticID is missing', function() {
    vecticObj = new vectic({
      target: vecticTargetMock,
    });
    expect(vecticObj.rootID).toEqual(undefined);
  });

  // Preset values
  it('pathBase should be Expected URL', function() {
    vecticObj = new vectic(vecticParamsMock);
    expect(vecticObj.pathBase).toEqual('http://vecticdev.firebaseio.com/');
  });
  it('pathVectic should be Expected URL', function() {
    vecticObj = new vectic(vecticParamsMock);
    expect(vecticObj.pathVectic).toEqual('http://vecticdev.firebaseio.com/vectic/');
  });
  it('pathTemplate should be Expected URL', function() {
    vecticObj = new vectic(vecticParamsMock);
    expect(vecticObj.pathTemplate).toEqual('http://vecticdev.firebaseio.com/template/');
  });
  it('pathPalette should be Expected URL', function() {
    vecticObj = new vectic(vecticParamsMock);
    expect(vecticObj.pathPalette).toEqual('http://vecticdev.firebaseio.com/palette/');
  });

  describe('function', function() {
    vecticObj;
    beforeEach(function() {
      vecticObj = new vectic(vecticParamsMock);
      vecticObj.firebaseLib = firebaseLibMock;
      spyOn(vecticObj, 'initHTML');
      spyOn(vecticObj, 'initFirebase');
      spyOn(vecticObj, 'firebaseLib');
      spyOn(vecticObj, 'setVecticHooks');
      spyOn(vecticObj, 'getObjectsRef');
      spyOn(vecticObj, 'getTemplatesRef');
      spyOn(vecticObj, 'getPalettesRef');
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
      });
    });

    describe('initFirebase()', function() {
      it('should populate html boiler content on target', function() {
        vecticObj.initFirebase.and.callThrough();
        vecticObj.firebaseLib.and.returnValue(firebaseLibMockObj);
        vecticObj.initFirebase();
        expect(vecticObj.firebaseLib).toHaveBeenCalledWith('http://vecticdev.firebaseio.com/vectic/vectic1');
      });
      it('should store Firebase reference on vecticRef', function() {
        vecticObj.initFirebase.and.callThrough();
        vecticObj.firebaseLib.and.returnValue(firebaseLibMockObj);
        vecticObj.initFirebase();
        expect(vecticObj.vecticRef).toEqual(firebaseLibMockObj);
      });
      it('should store FB Vectic Objects reference on vecticObjectsRef', function() {
        vecticObj.initFirebase.and.callThrough();
        vecticObj.firebaseLib.and.returnValue(firebaseLibMockObj);
        vecticObj.initFirebase();
        expect(vecticObj.getObjectsRef).toHaveBeenCalled();
        expect(vecticObj.getTemplatesRef).toHaveBeenCalled();
        expect(vecticObj.getPalettesRef).toHaveBeenCalled();
      });
      it('should trigger setVecticHooks', function() {
        vecticObj.initFirebase.and.callThrough();
        vecticObj.initFirebase();
        expect(vecticObj.setVecticHooks).toHaveBeenCalled;
      });
    });

    describe('getObjectsRef()', function() {
      if('should call vecticRef.child() corrected', function() {
        vecticObj = new vectic(vecticParamsMock);
        vecticObj.vecticRef = firebaseLibMockObj;
        vecticObj.getObjectsRef();
        expect(vecticObj.vecticRef.child).toHaveBeenCalledWith('objects');
      });
    });
    describe('getTemplatesRef()', function() {
      if('should call vecticRef.child() corrected', function() {
        vecticObj = new vectic(vecticParamsMock);
        vecticObj.vecticRef = firebaseLibMockObj;
        vecticObj.getTemplatesRef();
        expect(vecticObj.vecticRef.child).toHaveBeenCalledWith('templates');
      });
    });
    describe('getPalettesRef()', function() {
      if('should call vecticRef.child() corrected', function() {
        vecticObj = new vectic(vecticParamsMock);
        vecticObj.vecticRef = firebaseLibMockObj;
        vecticObj.getPalettesRef();
        expect(vecticObj.vecticRef.child).toHaveBeenCalledWith('palettes');
      });
    });

    describe('setVecticHooks()', function() {
      it('should set "child_added" hooks ons and offs to epected functions', function() {
        vecticObj = new vectic(vecticParamsMock);
        var vecticObjectsRefMock = {on: function() {}, off: function() {}};
        var vecticTemplatesRefMock = {on: function() {}, off: function() {}};
        var vecticPalettesRefMock = {on: function() {}, off: function() {}};
        vecticObj.vecticRef = firebaseLibMockObj;
        spyOn(vecticObjectsRefMock, 'on');
        spyOn(vecticTemplatesRefMock, 'on');
        spyOn(vecticPalettesRefMock, 'on');
        spyOn(vecticObjectsRefMock, 'off');
        spyOn(vecticTemplatesRefMock, 'off');
        spyOn(vecticPalettesRefMock, 'off');
        vecticObj.vecticObjectsRef = vecticObjectsRefMock;
        vecticObj.vecticTemplatesRef = vecticTemplatesRefMock;
        vecticObj.vecticPalettesRef = vecticPalettesRefMock;
        vecticObj.setVecticHooks();
        expect(vecticObjectsRefMock.off).toHaveBeenCalledWith('child_added', vecticObj.addObject, vecticObj.refError);
        expect(vecticTemplatesRefMock.off).toHaveBeenCalledWith('child_added', vecticObj.addTemplate, vecticObj.refError);
        expect(vecticPalettesRefMock.off).toHaveBeenCalledWith('child_added', vecticObj.addPalette, vecticObj.refError);
        expect(vecticObjectsRefMock.on).toHaveBeenCalledWith('child_added', vecticObj.addObject, vecticObj.refError);
        expect(vecticTemplatesRefMock.on).toHaveBeenCalledWith('child_added', vecticObj.addTemplate, vecticObj.refError);
        expect(vecticPalettesRefMock.on).toHaveBeenCalledWith('child_added', vecticObj.addPalette, vecticObj.refError);
      });
    });

    xdescribe('refError()', function() {
      // TODO:
      it('should handle errors as expected', function() {
        // TODO
      });
    });

    describe('addObject()', function() {
      it('should fetch key() from Firebase object', function() {
        var fbMock = {key: function() {}, val: function() {}};
        spyOn(fbMock, 'key');
        vecticObj.addObject(fbMock);
        expect(fbMock.key).toHaveBeenCalled();
      });
      it('should fetch val() from Firebase object', function() {
        var fbMock = {key: function() {}, val: function() {}};
        spyOn(fbMock, 'val');
        vecticObj.addObject(fbMock);
        expect(fbMock.val).toHaveBeenCalled();
      });
      // TODO:
    });
    describe('addTemplate()', function() {
      it('should fetch key() from Firebase object', function() {
        var fbMock = {key: function() {}, val: function() {}};
        spyOn(fbMock, 'key');
        vecticObj.addTemplate(fbMock);
        expect(fbMock.key).toHaveBeenCalled();
      });
      it('should fetch val() from Firebase object', function() {
        var fbMock = {key: function() {}, val: function() {}};
        spyOn(fbMock, 'val');
        vecticObj.addObject(fbMock);
        expect(fbMock.val).toHaveBeenCalled();
      });
      // TODO:
    });
    describe('addPalette()', function() {
      it('should fetch key() from Firebase object', function() {
        var fbMock = {key: function() {}, val: function() {}};
        spyOn(fbMock, 'key');
        vecticObj.addPalette(fbMock);
        expect(fbMock.key).toHaveBeenCalled();
      });
      it('should fetch val() from Firebase object', function() {
        var fbMock = {key: function() {}, val: function() {}};
        spyOn(fbMock, 'val');
        vecticObj.addObject(fbMock);
        expect(fbMock.val).toHaveBeenCalled();
      });
      // TODO:
    });
  });

  


  /*vecticObj;
  
  // Init vectic
  beforeEach(function() {
    vecticObj = new vectic(vecticParamsMock);
  });*/

  
});
