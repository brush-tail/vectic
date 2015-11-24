'use strict';

// Copy of _htmlBoiler from index.js, ensures typos are not added
var _htmlBoilerMock = '';
_htmlBoilerMock += '<span class="svgContainer">';
_htmlBoilerMock += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="{{ROOTID}}">';
_htmlBoilerMock += '<defs id="palettes"></defs>';
_htmlBoilerMock += '<defs id="templates"></defs>';
_htmlBoilerMock += '<g id="objects"></g>';
_htmlBoilerMock += '</svg>';

_htmlBoilerMock += '<style>';
_htmlBoilerMock += '.svgContainer {';
_htmlBoilerMock += '-webkit-touch-callout: none !important;';
_htmlBoilerMock += '-webkit-user-select: none !important;';
_htmlBoilerMock += '-khtml-user-select: none !important;';
_htmlBoilerMock += '-moz-user-select: none !important;';
_htmlBoilerMock += '-ms-user-select: none !important;';
_htmlBoilerMock += 'user-select: none !important;';
_htmlBoilerMock += '}';
_htmlBoilerMock += '.svgContainer svg:not([width]) {';
_htmlBoilerMock += 'width: 100% !important;';
_htmlBoilerMock += '}';
// _htmlBoilerMock += 'svg use {';
// _htmlBoilerMock += 'pointer-events: none;';
// _htmlBoilerMock += '}';
_htmlBoilerMock += '</style>';
_htmlBoilerMock += '</span>';

function outerhtml(jqObj) {
  return $('<div>').append(jqObj.clone()).html();
}

xdescribe('_dataWrapper()', function() {
  // TODO:
});

describe('vectic()', function () {
  var vecticObj, vecticTargetMock, vecticParamsMock, templateParamsMock, firebaseLibMock, firebaseLibMockObj;

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

    templateParamsMock = {
      target: vecticTargetMock,
      templateID: 'template1',
    };

    firebaseLibMockObj = {
      child: function() {return firebaseLibMockObj;},
      off: function() {},
      on: function() {},
      once: function() {},
    };
    firebaseLibMock = function() {
      return firebaseLibMockObj;
    };

    // Global Spies
    spyOn(vecticTargetMock, 'html');
    spyOn(firebaseLibMockObj, 'child').and.callThrough();
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
    expect(vecticObj.rootID).toEqual(null);
  });
  it('should exit and fail if vecticID is missing', function() {
    vecticObj = new vectic({
      target: vecticTargetMock,
    });
    expect(vecticObj.rootID).toEqual(null);
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
      spyOn(vecticObj, 'getDoms');
      spyOn(vecticObj, 'firebaseLib').and.callThrough();
      spyOn(vecticObj, 'setVecticHooks');
      spyOn(vecticObj, 'setTemplateHooks');
      spyOn(vecticObj, 'getObjectsRef');
      spyOn(vecticObj, 'getTemplatesRef');
      spyOn(vecticObj, 'getPalettesRef');
    });

    describe('on creation', function() {
      it('should not populate inner html()', function() {
        expect(vecticTargetMock.html).not.toHaveBeenCalled();
      });
    });

    describe('init() - vecticID', function() {
      beforeEach(function() {
        vecticObj.init();
      });
      it('should trigger initHTML()', function() {
        expect(vecticObj.initHTML).toHaveBeenCalled();
      });
      it('should trigger getDoms()', function() {
        expect(vecticObj.getDoms).toHaveBeenCalled();
      });
      it('should populate html boiler content on target', function() {
        expect(vecticObj.firebaseLib).toHaveBeenCalledWith('http://vecticdev.firebaseio.com/vectic/vectic1');
      });
      it('should store Firebase reference on vecticRef', function() {
        expect(vecticObj.vecticRef).toEqual(firebaseLibMockObj);
      });
      it('should store FB Vectic Objects reference on vecticObjectsRef', function() {
        expect(vecticObj.getObjectsRef).toHaveBeenCalled();
        expect(vecticObj.getTemplatesRef).toHaveBeenCalled();
        expect(vecticObj.getPalettesRef).toHaveBeenCalled();
      });
      it('should trigger setVecticHooks', function() {
        expect(vecticObj.setVecticHooks).toHaveBeenCalled();
      });
      it('should not trigger setTemplateHooks', function() {
        expect(vecticObj.setTemplateHooks).not.toHaveBeenCalled();
      });
    });

    xdescribe('initHTML()', function() {
      // Disabled for now while initHTML changes
      it('should populate html boiler content on target', function() {
        vecticObj.initHTML.and.callThrough();
        vecticObj.rootID = 'xxxx';
        vecticObj.initHTML();
        expect(vecticTargetMock.html).toHaveBeenCalledWith(_htmlBoilerMock.replace('{{ROOTID}}', 'xxxx'));
      });
    });

    xdescribe('getDoms()', function() {
      beforeEach(function() {
        vecticObj = new vectic(vecticParamsMock);
        vecticObj.rootID = 'test1';
      });
      it('should get container DOM Objects', function() {
        // TODO: Doesn't currently work, htmls is not rendered correctly to being with
        vecticObj.initHTML();
        vecticObj.getDoms();
        expect(typeof vecticObj.objectContainerDom).toEqual('object');;
        expect(typeof vecticObj.templateContainerDom).toEqual('object');;
        expect(typeof vecticObj.paletteContainerDom).toEqual('object');;
      });
      // TODO: Write tests to make sure DOM objects are selected correctly if possible
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
        var vecticSettingsRefMock = {on: function() {}, off: function() {}};
        var vecticObjectsRefMock = {on: function() {}, off: function() {}};
        var vecticTemplatesRefMock = {on: function() {}, off: function() {}};
        var vecticPalettesRefMock = {on: function() {}, off: function() {}};
        vecticObj.vecticRef = firebaseLibMockObj;
        spyOn(vecticObjectsRefMock, 'on');
        spyOn(vecticTemplatesRefMock, 'on');
        spyOn(vecticPalettesRefMock, 'on');
        spyOn(vecticSettingsRefMock, 'on');
        // TODO: Settings child spy
        firebaseLibMockObj.child.and.returnValue(vecticSettingsRefMock);
        spyOn(vecticObjectsRefMock, 'off');
        spyOn(vecticTemplatesRefMock, 'off');
        spyOn(vecticPalettesRefMock, 'off');
        spyOn(vecticSettingsRefMock, 'off');
        // TODO: Settings child spy
        firebaseLibMockObj.child.and.returnValue(vecticSettingsRefMock);
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
        expect(firebaseLibMockObj.child).toHaveBeenCalledWith('settings');
        expect(vecticSettingsRefMock.off).toHaveBeenCalledWith('value', vecticObj.settingsChange, vecticObj.refError);
        expect(firebaseLibMockObj.child).toHaveBeenCalledWith('settings');
        expect(vecticSettingsRefMock.on).toHaveBeenCalledWith('value', vecticObj.settingsChange, vecticObj.refError);
        expect(vecticSettingsRefMock.off).toHaveBeenCalledWith('value', vecticObj.saveSettingsLocal, vecticObj.refError);
        expect(vecticSettingsRefMock.on).toHaveBeenCalledWith('value', vecticObj.saveSettingsLocal, vecticObj.refError);
      });
    });

    xdescribe('refError()', function() {
      // TODO:
      it('should handle errors as expected', function() {
        expect(false).toEqual(true);
      });
    });

    xdescribe('settingsChange()', function() {
      // TODO:
      it('needs tests', function() {
        expect(false).toEqual(true);
      });
    });

    describe('addObject()', function() {
      var jqueryMockObj = {
        setAttributeNS: function() {},
      };
      var newObjectDomMock = {
        get: function() {
          return jqueryMockObj
        },
      };
      var fbData = {
        template: 'template1',
        x: '1',
        y: '2',
        width: '3',
        height: '4',
      };
      var fbMock = {key: function() {return 'key1'}, val: function() {return fbData},};
      var objectContainerDomMock = {append:function() {},};
      beforeEach(function() {
        vecticObj = new vectic(vecticParamsMock);
        spyOn(fbMock, 'key').and.callThrough();
        spyOn(fbMock, 'val').and.callThrough();
        spyOn(objectContainerDomMock, 'append');
        spyOn(vecticObj, 'setObjectAttributes');
        spyOn(vecticObj, 'newObjectDom').and.returnValue(newObjectDomMock);
      });
      it('should fetch key() and val() from Firebase object', function() {
        vecticObj.addObject(fbMock);
        expect(fbMock.key).toHaveBeenCalled();
        expect(fbMock.val).toHaveBeenCalled();
      });
      it('should get DOM Object from newObjectDom()', function() {
        vecticObj.addObject(fbMock);
        expect(vecticObj.newObjectDom).toHaveBeenCalledWith('key1');
      });
      xit('should append newObjectDom() content to objectContainerDom via jquery', function() {
        // TODO: Disabled as this object is wrapped in jquery getter
        vecticObj.objectContainerDom = objectContainerDomMock;
        vecticObj.addObject(fbMock);
        expect(objectContainerDomMock.append).toHaveBeenCalledWith(newObjectDomMock);
      });
      it('should run setObjectAttributes() with supplied data', function() {
        vecticObj.addObject(fbMock);
        expect(vecticObj.setObjectAttributes).toHaveBeenCalledWith(newObjectDomMock, fbData);
      });
    });
    describe('setObjectAttributes()', function() {
      var objectDomMock = {
        setAttributeNS: function() {},
      };
      var dataMock = {
        template: 'template1',
        x: '1',
        y: '2',
        width: '3',
        height: '4',
      };
      beforeEach(function() {
        vecticObj = new vectic(vecticParamsMock);
        spyOn(objectDomMock, 'setAttributeNS');
      });
      it('should setAttributeNS() for each expected attribute', function() {
        vecticObj.setObjectAttributes(objectDomMock, dataMock);
        expect(objectDomMock.setAttributeNS).toHaveBeenCalledWith('http://www.w3.org/1999/xlink','xlink:href','#ttemplate1');
        expect(objectDomMock.setAttributeNS).toHaveBeenCalledWith(null,'x','1');
        expect(objectDomMock.setAttributeNS).toHaveBeenCalledWith(null,'y','2');
        expect(objectDomMock.setAttributeNS).toHaveBeenCalledWith(null,'width','3');
        expect(objectDomMock.setAttributeNS).toHaveBeenCalledWith(null,'height','4');
      });
    });
    describe('newObjectDom()', function() {
      it('should return a <use> element', function() {
        expect(outerhtml($(vecticObj.newObjectDom('key1')))).toEqual('<use id="ukey1" objid="key1"></use>');;
      });
    });


    describe('addTemplate()', function() {
      var fbMock = {key: function() {return 'key1'}, val: function() {return {
        template: 'template1',
      }}};
      var templateDomMock = {};
      beforeEach(function() {
        vecticObj = new vectic(vecticParamsMock);
        spyOn(fbMock, 'key').and.callThrough();
        spyOn(fbMock, 'val').and.callThrough();
        spyOn(vecticObj, 'newTemplateDom').and.returnValue(templateDomMock);
        spyOn(vecticObj, 'initTemplate');
      });
      it('should fetch key() and val() from Firebase object', function() {
        vecticObj.addTemplate(fbMock);
        expect(fbMock.key).toHaveBeenCalled();
        expect(fbMock.val).toHaveBeenCalled();
      });
      it('should ask newTemplateDom() for a new DOM object', function() {
        vecticObj.addTemplate(fbMock);
        expect(vecticObj.newTemplateDom).toHaveBeenCalledWith('key1');
      });
      it('should call initTemplate() to create separate DB object watcher', function() {
        vecticObj.rootID = 'testRootID';
        vecticObj.addTemplate(fbMock);
        expect(vecticObj.initTemplate).toHaveBeenCalledWith({
          id: 'template1',
          vecticid: 'vectic1',
          target: templateDomMock,
          path: 'http://vecticdev.firebaseio.com/template/',
        });
      });
      // TODO:
    });
    describe('newTemplateDom()', function() {
      it('should return a <use> element', function() {
        expect(outerhtml(vecticObj.newTemplateDom('key1'))).toEqual('<svg id="tkey1"></svg>');;
      });
    });
    xdescribe('initTemplate()', function() {
      // TODO:
      it('needs tests written', function() {
        expect(false).toEqual(true);
      });
    });


    describe('addPalette()', function() {
      var fbMock = {key: function() {return 'key1'}, val: function() {return 'val1'}};
      beforeEach(function() {
        vecticObj = new vectic(vecticParamsMock);
        spyOn(fbMock, 'key').and.callThrough();
        spyOn(fbMock, 'val').and.callThrough();
        spyOn(vecticObj, 'newPaletteDom');
      });
      it('should fetch key() and val() from Firebase object', function() {
        vecticObj.addPalette(fbMock);
        expect(fbMock.key).toHaveBeenCalled();
        expect(fbMock.val).toHaveBeenCalled();
      });
      it('should ask newPaletteDom() for a new DOM object', function() {
        vecticObj.addPalette(fbMock);
        expect(vecticObj.newPaletteDom).toHaveBeenCalledWith('key1');
      });
      // TODO:
    });
    xdescribe('newPaletteDom()', function() {
      it('needs a test', function() {
        expect(false).toEqual(true);
        // TODO:
      });
    });

  });

  describe('function', function() {
    vecticObj;
    beforeEach(function() {
      vecticObj = new vectic(templateParamsMock);
      vecticObj.firebaseLib = firebaseLibMock;
      spyOn(vecticObj, 'initHTML');
      spyOn(vecticObj, 'getDoms');
      spyOn(vecticObj, 'firebaseLib').and.callThrough();
      spyOn(vecticObj, 'setVecticHooks');
      spyOn(vecticObj, 'setTemplateHooks');
      spyOn(vecticObj, 'getObjectsRef');
      spyOn(vecticObj, 'getTemplatesRef');
      spyOn(vecticObj, 'getPalettesRef');
    });

    describe('init() - templateID', function() {
      beforeEach(function() {
        vecticObj.init();
      });
      it('should trigger initHTML()', function() {
        expect(vecticObj.initHTML).toHaveBeenCalled();
      });
      it('should trigger getDoms()', function() {
        expect(vecticObj.getDoms).toHaveBeenCalled();
      });
      it('should populate html boiler content on target', function() {
        expect(vecticObj.firebaseLib).toHaveBeenCalledWith('http://vecticdev.firebaseio.com/template/template1');
      });
      it('should store Firebase reference on templateRef', function() {
        expect(vecticObj.templateRef).toEqual(firebaseLibMockObj);
      });
      it('should not set getObjectsRef and getTemplatesRef', function() {
        expect(vecticObj.getObjectsRef).not.toHaveBeenCalled();
        expect(vecticObj.getTemplatesRef).not.toHaveBeenCalled();
      });
      it('should set getPalettesRef', function() {
        expect(vecticObj.getPalettesRef).toHaveBeenCalled();
      });
      it('should not trigger setTemplateHooks', function() {
        expect(vecticObj.setVecticHooks).not.toHaveBeenCalled();
      });
      it('should trigger setTemplateHooks', function() {
        expect(vecticObj.setTemplateHooks).toHaveBeenCalled();
      });
    });
  });

  


  /*vecticObj;
  
  // Init vectic
  beforeEach(function() {
    vecticObj = new vectic(vecticParamsMock);
  });*/

  
});

xdescribe('vectic_template()', function() {
  // TODO:
  it('needs tests written', function() {
    expect(false).toEqual(true);
  });
});

xdescribe('vectic_palette()', function() {
  // TODO:
  it('needs tests written', function() {
    expect(false).toEqual(true);
  });
});