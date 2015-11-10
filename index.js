'use strict';
/*
**  Initializer
**  Usage:
**    new vectic({target:$('divVectic1'), vecticID:'vectic1'});
**  Params:
**    target (jquery object):
**      Div/Span object to be used for vectic rendering
**    vecticID (string):
**      ID of vectic to load/display
*/

var _vecticUID = 0;

var _htmlBoiler = '\
<span class="svgContainer">\
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="{{ROOTID}}">\
    <defs id="palettes"></defs>\
    <defs id="templates"></defs>\
    <g id="objects"></g>\
    <g id="templates_edit"></g>\
  </svg>\
</span>\
';

var _globalVecticStyler = '\
.svgContainer {\
  -webkit-touch-callout: none !important;\
  -webkit-user-select: none !important;\
  -khtml-user-select: none !important;\
  -moz-user-select: none !important;\
  -ms-user-select: none !important;\
  user-select: none !important;\
}\
.svgContainer svg:not([width]) {\
  width: 100% !important;\
}\
';

function _refError(params) {
  // TODO: Handle Firebase error messages
  console.error('Firebase refError()');
  console.error(params);
}

function _generateElement(data, key) {
  if(!data) {return console.error('_generateElement missing data');}
  if(!key) {return console.error('_generateElement missing key');}

  var sOutput = '';
  switch(data.tag) {
    case 'circle':
      if(!(data.r && data.cx && data.cy)) {return;}
      sOutput += '<circle objid="'+key+'" id="t'+key+'" r="'+data.r+'"';
      if(data.color) {sOutput+=' class="c'+data.color+'"';}
      if(data.cx) {sOutput+=' cx="'+data.cx+'"';}
      if(data.cy) {sOutput+=' cy="'+data.cy+'"';}
      sOutput += '></circle>';
      break;
    case 'rect':
      if(!(data.x && data.y && data.width && data.height)) {return;}
      sOutput += '<rect objid="'+key+'" id="t'+key+'" width="'+data.width+'" height="'+data.height+'"';
      if(data.color) {sOutput+=' class="c'+data.color+'"';}
      if(data.x) {sOutput+=' x="'+data.x+'"';}
      if(data.y) {sOutput+=' y="'+data.y+'"';}
      sOutput += '></rect>';
      break;
    default:
      console.error('Unknown element tag: '+data.tag);
      break;
  }
  return sOutput;
};

function _generateElementObj(data, key) {
  if(!data) {return console.error('_generateElement missing data');}
  if(!key) {return console.error('_generateElement missing key');}

  var sOutput = '';
  switch(data.tag) {
    case 'circle':
      if(!(data.r && data.cx && data.cy)) {return;}
      sOutput = document.createElementNS('http://www.w3.org/2000/svg', ('circle'));
      sOutput.setAttributeNS(null, 'objid', key);
      sOutput.setAttributeNS(null, 'id', 't'+key);
      sOutput.setAttributeNS(null, 'r', data.r);
      sOutput.setAttributeNS(null, 'cx', data.cx);
      sOutput.setAttributeNS(null, 'cy', data.cy);
      if(data.color) {sOutput.setAttributeNS(null, 'class', 'c'+data.color);}
      break;
    case 'rect':
      if(!(data.x && data.y && data.width && data.height)) {return;}
      sOutput = document.createElementNS('http://www.w3.org/2000/svg', ('rect'));
      sOutput.setAttributeNS(null, 'objid', key);
      sOutput.setAttributeNS(null, 'id', 't'+key);
      sOutput.setAttributeNS(null, 'x', data.x);
      sOutput.setAttributeNS(null, 'y', data.y);
      sOutput.setAttributeNS(null, 'width', data.width);
      sOutput.setAttributeNS(null, 'height', data.height);
      if(data.color) {sOutput.setAttributeNS(null, 'class', 'c'+data.color);}
      break;
    default:
      console.error('Unknown element tag: '+data.tag);
      break;
  }
  return sOutput;
};

function _vectic_template(params) {
  var _this = this;
  this.refError = _refError;
  params = params || {};
  this.id = params.id || null;
  // this.vecticid = params.vecticid || null;
  this.target = params.target || null;
  this.path = params.path || null;

  if(!this.id)           { return console.error('vectic_template(): No ID supplied'); }
  // if(!this.vecticid)     { return console.error('vectic_template(): No Vectic ID supplied'); }
  if(!this.target)       { return console.error('vectic_template(): No Target template element supplied'); }
  if(!this.path)     { return console.error('vectic_template(): No path supplied'); }
  if(this.target && !this.target.html)  { return console.error('vectic_template(): Target is not correct JQuery DOM object'); }

  // Get Firebase if available
  if(typeof Firebase != 'undefined') {
    this.firebaseLib = Firebase;
  } else {
    console.error('_vectic_template(): could not find Firebase library');
  }

  this.onValue = function(snapshot, prevChildKey) {
    var val = snapshot.val();
    var elementKey = snapshot.key();

    if(!(val && val.settings && val.settings.width && val.settings.height && val.elements)) {return console.error('template '+elementKey+' incomplete');}

    // Set viewBox
    var viewBox = '0 0 '+val.settings.width+' '+val.settings.height;
    _this.target.get(0).setAttributeNS(null, 'viewBox', viewBox);

    // Set palette
    if(val.palette) {_this.target.get(0).setAttributeNS(null, 'class', 'p'+val.palette);}

    var sOutput = '';
    for(var key in val.elements) {
      var value = val.elements[key];

      sOutput += _generateElement(value, key);
      
    //   sOutput += '#p'+_this.id+' .c'+key+' {';
    //   if(value.fill != undefined) {sOutput+='fill:'+value.fill+';';}
    //   if(value.stroke != undefined) {sOutput+='stroke:'+value.stroke+';';}
    //   if(value['stroke-width'] != undefined) {sOutput+='stroke-width:'+value['stroke-width']+';';}
    //   sOutput += '} ';
    }

    _this.target.html(sOutput);
    if(params.rootid) {
      // Update root element with NS setting to trigger SVG render update
      document.querySelector('svg#'+params.rootid).setAttributeNS(null, 'id', params.rootid);
    }
  };

  this.destroy = function() {
    // TODO: Disconnect from database, remove watchers, destory what we can
  };

  this.templateDef = new this.firebaseLib(this.path+this.id);
  // this.queueDef = params.queueDef || new Firebase(this.pathQueue);
  // this.detailsDef = params.detailDef || new Firebase(this.pathDetail+this.id);
  // this.details = $firebaseObject(this.detailsDef);
  
  // this.templateDef.once('value', this.onValue);
  this.templateDef.on('value', this.onValue, this.refError);
}

function _vectic_palette(params) {
  var _this = this;
  this.refError = _refError;
  params = params || {};
  this.id = params.id || null;
  // this.vecticid = params.vecticid || null;
  this.target = params.target || null;
  this.path = params.path || null;

  if(!this.id)            { return console.error('vectic_palette(): No ID supplied'); }
  // if(!this.vecticid)      { return console.error('vectic_palette(): No Vectic ID supplied'); }
  if(!this.target)        { return console.error('vectic_palette(): No Target palette element supplied'); }
  if(!this.path)          { return console.error('vectic_palette(): No path supplied'); }
  if(this.target && 
    !this.target.html)    { return console.error('vectic_palette(): Target is not correct JQuery DOM object'); }

  // Get Firebase if available
  if(typeof Firebase != 'undefined') {
    this.firebaseLib = Firebase;
  } else {
    console.error('_vectic_palette(): could not find Firebase library');
  }

  this.onValue = function(snapshot, prevChildKey) {

    var val = snapshot.val();
    if(!val && val.colors) {return;}

    var sOutput = '';
    for(var key in val.colors) {
      var value = val.colors[key];
      
      sOutput += '.p'+_this.id+' .c'+key+' {';
      if(value.fill != undefined) {sOutput+='fill:'+value.fill+';';}
      if(value.stroke != undefined) {sOutput+='stroke:'+value.stroke+';';}
      if(value['stroke-width'] != undefined) {sOutput+='stroke-width:'+value['stroke-width']+';';}
      sOutput += '} ';
    }

    _this.target.html(sOutput);
    if(params.rootid) {
      // Update root element with NS setting to trigger SVG render update
      document.querySelector('svg#'+params.rootid).setAttributeNS(null, 'id', params.rootid);
    }
  };

  this.destroy = function() {};

  this.paletteDef = new this.firebaseLib(this.path+this.id);
  // this.queueDef = params.queueDef || new Firebase(this.pathQueue);
  // this.detailsDef = params.detailDef || new Firebase(this.pathDetail+this.id);
  // this.details = $firebaseObject(this.detailsDef);
  
  // this.paletteDef.once('value', this.onValue);
  this.paletteDef.on('value', this.onValue, this.refError);
}


function vectic(params) {
  // Define
  params = params || {};
  var _this = this;
  this.refError = _refError;
  this.targetObject = params.target;
  this.targetObjectSvg = null;
  this.vecticID = params.vecticID;
  this.templateID = params.templateID;
  this.firebaseLib = undefined;
  this.vecticRef = undefined;
  this.templateRef = undefined;

  this.objects = {};
  this.templates = {};
  this.palettes = {};

  this.objectContainerDom = null;
  this.templateContainerDom = null;
  this.templateEditContainerDom = null;
  this.paletteContainerDom = null;

  this.vecticTemplateHandlers = {};
  this.vecticPaletteHandlers = {};

  // Local value storage for reference
  this.dataSettings = null;
  this.sizeSettings = null;

  
  // ** Mouse interactions

  // Root
  this.moveRoot = params.moveRoot || function() {};
  this.clickRoot = params.clickRoot || function() {};
  this.enterRoot = params.enterRoot || function() {};
  this.leaveRoot = params.leaveRoot || function() {};
  this.scrollRoot = params.scrollRoot || function() {};
  this.mouseupRoot = params.mouseupRoot || function() {};
  this.mousedownRoot = params.mousedownRoot || function() {};

  // Objects
  this.moveObject = params.moveObject || function() {};
  this.clickObject = params.clickObject || function() {};
  this.enterObject = params.enterObject || function() {};
  this.leaveObject = params.leaveObject || function() {};
  this.scrollObject = params.scrollObject || function() {};
  this.mouseupObject = params.mouseupObject || function() {};
  this.mousedownObject = params.mousedownObject || function() {};


  // Get Firebase if available
  if(typeof Firebase != 'undefined') {
    this.firebaseLib = Firebase;
  } else {
    console.error('vectic(): could not find Firebase library');
  }

  Object.defineProperty(this, 'pathBase', {
    get: function() {return 'http://vecticdev.firebaseio.com/';},
  });
  Object.defineProperty(this, 'pathVectic', {
    get: function() {return this.pathBase+'vectic/';},
  });
  Object.defineProperty(this, 'pathTemplate', {
    get: function() {return this.pathBase+'template/';},
  });
  Object.defineProperty(this, 'pathPalette', {
    get: function() {return this.pathBase+'palette/';},
  });

  if(!(this.targetObject && this.targetObject.html)) {return console.error('vectic(): missing target jQuery object');}
  if(!(this.vecticID || this.templateID)) {return console.error('vectic(): missing vecticID or templateID');}

  // Generate unique ID to distinguish each vectic object within interface
  if(this.vecticID) {
    this.rootID = 'v'+this.vecticID+'_id'+(_vecticUID+=1);
  } else if(this.templateID) {
    this.rootID = 't'+this.templateID+'_id'+(_vecticUID+=1);
  }

  // init() is triggered separately so jasmine tests can watch internal functions for testing purposes
  this.init = function() {
    if(!_this.firebaseLib) {return console.error('vectic.init(): Missing Firebase library');}

    _this.initStyles();
    _this.initHTML();
    _this.getDoms();

    if(_this.vecticID) {
      _this.vecticRef = new _this.firebaseLib(_this.pathVectic+_this.vecticID);
      _this.vecticObjectsRef = _this.getObjectsRef();
      _this.vecticTemplatesRef = _this.getTemplatesRef();
      _this.vecticPalettesRef = _this.getPalettesRef();
      _this.setVecticHooks();
    }
    else if(_this.templateID) {
      _this.templateRef = new _this.firebaseLib(_this.pathTemplate+_this.templateID);
      _this.vecticPalettesRef = _this.getPalettesRef();
      _this.setTemplateHooks();
    }
    else {
      return console.error('vectic: Missing vecticID or templateID');
    }

    _this.clickRegister()
  };

  this.initStyles = function() {
    // Add css styles and reusable content to <body> if not already added
    if($('body #vecticStyler').length) {return;}

    var vecticStyler = $('<div id="vecticStyler">'+_globalVecticStyler+'</div>');
    $('body').append(vecticStyler);
  };

  // Sets internal static HTML
  this.initHTML = function() {
    if(!_this.targetObject) {return console.error('vectic: Target object missing');}
    _this.targetObject.html(_htmlBoiler.replace('{{ROOTID}}', _this.rootID));
    _this.targetObjectSvg = ($(_this.targetObject)).find('svg').get(0);
  };

  this.getDoms = function() {
    _this.objectContainerDom = $('svg#'+_this.rootID+' g#objects').get(0);
    _this.templateContainerDom = $('svg#'+_this.rootID+' defs#templates').get(0);
    _this.paletteContainerDom = $('svg#'+_this.rootID+' defs#palettes').get(0);
    _this.templateEditContainerDom = $('svg#'+_this.rootID+' g#templates_edit').get(0);
  };

  this.getObjectsRef = function() {
    if(!(_this.vecticRef || _this.templateRef)) {return console.error('vectic.getObjectsRef: Could not find vecticRef');}
    return (_this.vecticRef || _this.templateRef).child('objects');
  };
  this.getTemplatesRef = function() {
    if(!(_this.vecticRef || _this.templateRef)) {return console.error('vectic.getTemplatesRef: Could not find vecticRef');}
    return (_this.vecticRef || _this.templateRef).child('templates');
  };
  this.getPalettesRef = function() {
    if(!(_this.vecticRef || _this.templateRef)) {return console.error('vectic.getPalettesRef: Could not find vecticRef');}
    return (_this.vecticRef || _this.templateRef).child('palettes');
  };

  this.setVecticHooks = function() {
    if(!_this.vecticRef) {return console.error('vectic: Could not create hooks, not connected to Database');}

    _this.vecticPalettesRef.off('child_added', _this.addPalette, _this.refError);
    _this.vecticTemplatesRef.off('child_added', _this.addTemplate, _this.refError);
    _this.vecticObjectsRef.off('child_added', _this.addObject, _this.refError);

    _this.vecticPalettesRef.on('child_added', _this.addPalette, _this.refError);
    _this.vecticTemplatesRef.on('child_added', _this.addTemplate, _this.refError);
    _this.vecticObjectsRef.on('child_added', _this.addObject, _this.refError);

    _this.vecticRef.child('settings').off('value', _this.settingsChange, _this.refError);
    _this.vecticRef.child('settings').on('value', _this.settingsChange, _this.refError);

    _this.vecticRef.child('settings').off('value', _this.saveSettingsLocal, _this.refError);
    _this.vecticRef.child('settings').on('value', _this.saveSettingsLocal, _this.refError);
  };

  this.setTemplateHooks = function() {
    if(!_this.templateRef) {return console.error('vectic: Could not create hooks, not connected to Database');}

    _this.vecticPalettesRef.off('child_added', _this.addPalette, _this.refError);
    _this.vecticPalettesRef.on('child_added', _this.addPalette, _this.refError);

    _this.templateRef.child('settings').off('value', _this.settingsChange, _this.refError);
    _this.templateRef.child('settings').on('value', _this.settingsChange, _this.refError);

    _this.templateRef.child('settings').off('value', _this.saveSettingsLocal, _this.refError);
    _this.templateRef.child('settings').on('value', _this.saveSettingsLocal, _this.refError);

    _this.templateRef.child('elements').off('child_added', _this.updateTemplateEdit, _this.refError);
    _this.templateRef.child('elements').on('child_added', _this.updateTemplateEdit, _this.refError);

    _this.templateRef.child('palette').off('value', _this.updateTemplateEditPalette, _this.refError);
    _this.templateRef.child('palette').on('value', _this.updateTemplateEditPalette, _this.refError);
  };

  // Settings hook handlers
  this.settingsChange = function(snapshot) {
    var val = snapshot.val();
    if(!(val && val.width && val.height)) {return console.error('vectic settingsChange: missing width/height');}

    var viewBox = '0 0 '+val.width+' '+val.height;
    _this.targetObjectSvg.setAttributeNS(null, 'viewBox', viewBox);
  };

  this.saveSettingsLocal = function(snapshot) {
    _this.dataSettings = snapshot.val();
    _this.updateSizing();
  };

  // Object hook handlers
  this.newObjectDom = function(key) {
    var newDom = document.createElementNS('http://www.w3.org/2000/svg', ('use'));
    newDom.setAttributeNS(null, 'id', key);
    return newDom;
  };
  this.addObject = function(fbRef, prevKey) {
    var key = fbRef.key();
    var data = fbRef.val();
    // _this.objects[key] = data;
    var objectDom = _this.newObjectDom(key);
    _this.setObjectAttributes(objectDom, data);
    if(_this.objectContainerDom) {$(_this.objectContainerDom).append(objectDom);}
  };

  this.setObjectAttributes = function(objectDom, data) {
    objectDom.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", '#t'+data.template);
    objectDom.setAttributeNS(null, 'x', data.x || null);
    objectDom.setAttributeNS(null, 'y', data.y || null);
    objectDom.setAttributeNS(null, 'width', data.width || null);
    objectDom.setAttributeNS(null, 'height', data.height || null);
  };

  // Template hook handlers
  this.initTemplate = _vectic_template;      // Set as pointer for easy test mocking
  this.addTemplate = function(fbRef, prevKey) {
    var key = fbRef.key();
    var data = fbRef.val();

    var templateid = data.template;
    var templateDom = _this.newTemplateDom(key);
    if(_this.templateContainerDom) {$(_this.templateContainerDom).append(templateDom);}

    if(_this.vecticTemplateHandlers[key]) {_this.vecticTemplateHandlers[key].destroy();}
    _this.vecticTemplateHandlers[key] = new _this.initTemplate({
      id: templateid,
      rootid: _this.rootID,
      vecticid: _this.vecticID,
      target: templateDom,
      path: _this.pathTemplate,
    });
  };


  this.newTemplateDom = function(key) {
    return $('<svg id="t'+key+'"></svg>');
  };

  this.templateElementsChange = function(fbRef, prevKey) {
    var key = fbRef.key();
    var data = fbRef.val();

    var templateDom = _this.newTemplateDom(_this.templateID);
    if(_this.templateContainerDom) {$(_this.templateContainerDom).append(templateDom);}

    if(_this.vecticTemplateHandlers[key]) {_this.vecticTemplateHandlers[key].destroy();}
    _this.vecticTemplateHandlers[_this.templateID] = new _this.initTemplate({
      id: _this.templateID,
      rootid: _this.rootID,
      // vecticid: _this.templateID,
      target: templateDom,
      path: _this.pathTemplate,
    });
  }

  // Palette hook handlers
  this.initPalette = _vectic_palette;      // Set as pointer for easy test mocking
  this.addPalette = function(fbRef, prevKey) {
    var key = fbRef.key();
    var data = fbRef.val();

    var paletteid = data.palette;
    var paletteDom = _this.newPaletteDom(key);
    if(_this.paletteContainerDom) {$(_this.paletteContainerDom).append(paletteDom);}

    if(_this.vecticPaletteHandlers[key]) {_this.vecticPaletteHandlers[key].destroy();}
    var newObjData = {
      id: paletteid,
      rootid: _this.rootID,
      vecticid: _this.vecticID,
      target: paletteDom,
      path: _this.pathPalette,
    };
    _this.vecticPaletteHandlers[key] = new _this.initPalette(newObjData);
  };

  this.newPaletteDom = function(key) {
    return $('<style id="p'+key+'"></style>');
  };

  this.updateTemplateEditPalette = function(snapshot, prevKey) {
    var val = snapshot.val();
    var templateEditSelector = '#'+_this.rootID+' #templates_edit';
    var templateEdit = $(templateEditSelector);

    if(val) {templateEdit.get(0).setAttributeNS(null, 'class', 'p'+val);}
  };

  this.updateTemplateEdit = function(snapshot, prevKey) {
    // TODO: IN PROGRESS: Create/Update template objects in #templates_edit
    var key = snapshot.key();
    var val = snapshot.val();

    var templateEditSelector = '#'+_this.rootID+' #templates_edit';
    var templateEdit = $(templateEditSelector).get(0);
    var targetSelector = templateEditSelector+' t#'+key;
    var target = $(targetSelector).get(0);


    if(!templateEdit) {return console.error('updateTemplateEdit() unable to find templateEdit "'+templateEditSelector+'"');}

    var output = _generateElementObj(val, key);

    if(!output) {
      console.error('Failed to build template edit element '+key)
      console.error(val)
    }
    if(!target) {
      // Append object to parent
      $(templateEdit).append(output);
    }
    else {
      // Replace existing object
      $(target).replaceWith(output);
    }

    // Update root element with NS setting to trigger SVG render update
    document.querySelector('svg#'+_this.rootID).setAttributeNS(null, 'id', _this.rootID);
  };

  // Click controls
  this.clickRegister = function() {
    if(!_this.rootID) {return console.error('clickRegister() - no rootID');}

    // Root click
    $('svg#'+_this.rootID).on('click', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.clickRoot(params);
    });
    $('svg#'+_this.rootID).on('mousemove', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.moveRoot(params);
    });
    $('svg#'+_this.rootID).on('mouseenter', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.enterRoot(params);
    });
    $('svg#'+_this.rootID).on('mouseleave', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.leaveRoot(params);
    });
    $('svg#'+_this.rootID).on('scroll', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.scrollRoot(params);
    });
    $('svg#'+_this.rootID).on('mousedown', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.mousedownRoot(params);
    });
    $('svg#'+_this.rootID).on('mouseup', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.mouseupRoot(params);
    });


    // Object click
    $('svg#'+_this.rootID).on('click', 'use', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.clickObject(params);
    });
    $('svg#'+_this.rootID).on('mousemove', 'use', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.moveObject(params);
    });
    $('svg#'+_this.rootID).on('mouseenter', 'use', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.enterObject(params);
    });
    $('svg#'+_this.rootID).on('mouseleave', 'use', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.leaveObject(params);
    });
    $('svg#'+_this.rootID).on('scroll', 'use', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.scrollObject(params);
    });
    $('svg#'+_this.rootID).on('mouseup', 'use', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.mouseupObject(params);
    });
    $('svg#'+_this.rootID).on('mousedown', 'use', function(event) {
      var params = {
        event: event,
        this: this,
        rootID: _this.rootID,
      };
      _this.mousedownObject(params);
    });
  };

  // Resizing tools
  this.fixSize = function(val) {
    // Switches off scale-to-fit
    if(val === undefined) {return;}      // Ignore undefined values. Only null resets
    if(!_this.sizeSettings) {_this.sizeSettings = {};}
    _this.sizeSettings.fixSize = (val===true) || false;
    _this.updateSizing();
  };
  this.setWidth = function(val) {
    if(val === undefined) {return;}      // Ignore undefined values. Only null resets
    if(!_this.sizeSettings) {_this.sizeSettings = {};}
    _this.sizeSettings.width = val;
    _this.updateSizing();
  };
  this.setHeight = function(val) {
    if(val === undefined) {return;}      // Ignore undefined values. Only null resets
    if(!_this.sizeSettings) {_this.sizeSettings = {};}
    _this.sizeSettings.height = val;
    _this.updateSizing();
  };
  this.setZoom = function(val) {
    if(val === undefined) {return;}      // Ignore undefined values. Only null resets
    if(!_this.sizeSettings) {_this.sizeSettings = {};}
    _this.sizeSettings.zoom = val;
    _this.updateSizing();
  };
  this.aspectRatio = function(val) {
    // Ref - https://developer.mozilla.org/en/docs/Web/SVG/Attribute/preserveAspectRatio
    if(val === undefined) {return;}       // Ignore undefined values. Only null resets
    if(!_this.sizeSettings) {_this.sizeSettings = {};}
    _this.sizeSettings.preserveAspectRatio = val;
    _this.updateSizing();
  }

  this.updateSizing = function() {
    // TODO: Check both size and settings and update when both are not (undefined)
    if(!(_this.sizeSettings && _this.dataSettings)) {return;}

    var root = document.querySelector('svg#'+_this.rootID);

    var width = null;
    var height = null;

    if(_this.sizeSettings.fixSize) {
      if(_this.dataSettings.width) { width = _this.dataSettings.width; }
      if(_this.dataSettings.height) { height = _this.dataSettings.height; }
    }
    else if(_this.sizeSettings.width || _this.sizeSettings.height) {
      if(_this.sizeSettings.width) { width = _this.sizeSettings.width; }
      if(_this.sizeSettings.height) { height = _this.sizeSettings.height; }
    }
    
    if(_this.sizeSettings.zoom) {
      if(width) { width = width * this.sizeSettings.zoom; }
      if(height) { height = height * this.sizeSettings.zoom; }
    }

    if(width || height) {
      root.removeAttributeNS(null, 'width');
      root.removeAttributeNS(null, 'height');
      if(width) { root.setAttributeNS(null, 'width', width); }
      if(height) { root.setAttributeNS(null, 'height', height); }
    }

    root.removeAttributeNS(null, 'preserveAspectRatio');
    if(_this.sizeSettings.preserveAspectRatio) {
      root.setAttributeNS(null, 'preserveAspectRatio', _this.sizeSettings.preserveAspectRatio);
    }
  };
}
