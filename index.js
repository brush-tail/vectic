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

var _htmlBoiler = '';
_htmlBoiler += '<span class="svgContainer">';
_htmlBoiler += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="{{ROOTID}}">';
_htmlBoiler += '<defs id="palettes"></defs>';
_htmlBoiler += '<defs id="templates"></defs>';
_htmlBoiler += '<g id="objects"></g>';
_htmlBoiler += '</svg>';

_htmlBoiler += '<style>';
_htmlBoiler += '.svgContainer {';
_htmlBoiler += '-webkit-touch-callout: none !important;';
_htmlBoiler += '-webkit-user-select: none !important;';
_htmlBoiler += '-khtml-user-select: none !important;';
_htmlBoiler += '-moz-user-select: none !important;';
_htmlBoiler += '-ms-user-select: none !important;';
_htmlBoiler += 'user-select: none !important;';
_htmlBoiler += '}';
_htmlBoiler += '.svgContainer svg:not([width]) {';
_htmlBoiler += 'width: 100% !important;';
_htmlBoiler += '}';
_htmlBoiler += '</style>';
_htmlBoiler += '</span>';

function _refError(params) {
  // TODO: Handle Firebase error messages
  console.error('Firebase refError()');
  console.error(params);
}

function _vectic_template(params) {
  var _this = this;
  this.refError = _refError;
  params = params || {};
  this.id = params.id || null;
  this.vecticid = params.vecticid || null;
  this.target = params.target || null;
  this.path = params.path || null;

  if(!this.id)           { return console.error('vectic_template(): No ID supplied'); }
  if(!this.vecticid)     { return console.error('vectic_template(): No Vectic ID supplied'); }
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

    if(!(val && val.width && val.height && val.elements)) {return console.error('template '+elementKey+' incomplete');}

    // Set viewBox
    var viewBox = '0 0 '+val.width+' '+val.height;
    _this.target.get(0).setAttributeNS(null, 'viewBox', viewBox);

    // Set palette
    if(val.palette) {_this.target.get(0).setAttributeNS(null, 'class', 'p'+val.palette)}

    var sOutput = '';
    for(var key in val.elements) {
      var value = val.elements[key];

      switch(value.tag) {
        case 'circle':
          if(!(value.r)) {return;}
          sOutput += '<circle id="#t'+key+'" r="'+value.r+'"';
          if(value.color) {sOutput+=' class="c'+value.color+'"';}
          if(value.cx) {sOutput+=' cx="'+value.cx+'"';}
          if(value.cy) {sOutput+=' cy="'+value.cy+'"';}
          sOutput += '></circle>';
          break;
        case 'rect':
          if(!(value.width && value.height)) {return;}
          sOutput += '<rect id="#t'+key+'" width="'+value.width+'" height="'+value.height+'"';
          if(value.color) {sOutput+=' class="c'+value.color+'"';}
          if(value.x) {sOutput+=' x="'+value.x+'"';}
          if(value.y) {sOutput+=' y="'+value.y+'"';}
          sOutput += '></rect>';
          break;
        default:
          console.error('Unknown element tag: '+value.tag);
          break;
      }
      
    //   sOutput += '#p'+_this.id+' .c'+key+' {';
    //   if(value.fill != undefined) {sOutput+='fill:'+value.fill+';';}
    //   if(value.stroke != undefined) {sOutput+='stroke:'+value.stroke+';';}
    //   if(value['stroke-width'] != undefined) {sOutput+='stroke-width:'+value['stroke-width']+';';}
    //   sOutput += '} ';
    }

    _this.target.html(sOutput);
  };

  this.templateDef = new this.firebaseLib(this.path+this.id);
  // this.queueDef = params.queueDef || new Firebase(this.pathQueue);
  // this.detailsDef = params.detailDef || new Firebase(this.pathDetail+this.id);
  // this.details = $firebaseObject(this.detailsDef);
  
  // this.templateDef.once('value', this.onValue);
  this.templateDef.on('value', this.onValue, this.refError);

  this.destroy = function() {
    // TODO: Disconnect from database, remove watchers, destory what we can
  };
}

function _vectic_palette(params) {
  var _this = this;
  this.refError = _refError;
  params = params || {};
  this.id = params.id || null;
  this.vecticid = params.vecticid || null;
  this.target = params.target || null;
  this.path = params.path || null;

  if(!this.id)           { return console.error('vectic_palette(): No ID supplied'); }
  if(!this.vecticid)     { return console.error('vectic_palette(): No Vectic ID supplied'); }
  if(!this.target)       { return console.error('vectic_palette(): No Target template element supplied'); }
  if(!this.path)     { return console.error('vectic_palette(): No path supplied'); }
  if(this.target && !this.target.html)  { return console.error('vectic_palette(): Target is not correct JQuery DOM object'); }

  // Get Firebase if available
  if(typeof Firebase != 'undefined') {
    this.firebaseLib = Firebase;
  } else {
    console.error('_vectic_palette(): could not find Firebase library');
  }

  this.paletteDef = new this.firebaseLib(this.path+this.id);
  // this.queueDef = params.queueDef || new Firebase(this.pathQueue);
  // this.detailsDef = params.detailDef || new Firebase(this.pathDetail+this.id);
  // this.details = $firebaseObject(this.detailsDef);
  
  // this.paletteDef.once('value', this.onValue);
  this.paletteDef.on('value', this.onValue, this.refError);

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
  };

  this.destroy = function() {};
}


function vectic(params) {
  // Define
  params = params || {};
  var _this = this;
  this.refError = _refError;
  this.targetObject = params.target;
  this.targetObjectSvg = null;
  this.vecticID = params.vecticID;
  this.firebaseLib = undefined;
  this.vecticRef = undefined;

  this.objects = {};
  this.templates = {};
  this.palettes = {};

  this.objectContainerDom = null;
  this.templateContainerDom = null;
  this.paletteContainerDom = null;

  this.vecticTemplateHandlers = {};
  this.vecticPaletteHandlers = {};

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
  if(!this.vecticID) {return console.error('vectic(): missing vecticID');}

  // Generate unique ID to distinguish each vectic object within interface
  this.rootID = 'v'+this.vecticID+'_id'+(_vecticUID+=1);

  // init() is triggered separately so jasmine tests can watch internal functions for testing purposes
  this.init = function() {
    _this.initHTML();
    _this.getDoms();
    _this.initFirebase();
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
  };

  this.getObjectsRef = function() {
    if(!_this.vecticRef) {return console.error('vectic.getObjectsRef: Could not find vecticRef');}
    return _this.vecticRef.child('objects');
  };
  this.getTemplatesRef = function() {
    if(!_this.vecticRef) {return console.error('vectic.getTemplatesRef: Could not find vecticRef');}
    return _this.vecticRef.child('templates');
  };
  this.getPalettesRef = function() {
    if(!_this.vecticRef) {return console.error('vectic.getPalettesRef: Could not find vecticRef');}
    return _this.vecticRef.child('palettes');
  };

  this.initFirebase = function() {
    if(!_this.firebaseLib) {return console.error('vectic: Missing Firebase library');}
    if(!_this.vecticID) {return console.error('vectic: Missing vecticID');}
    _this.vecticRef = new _this.firebaseLib(_this.pathVectic+_this.vecticID);
    _this.vecticObjectsRef = _this.getObjectsRef();
    _this.vecticTemplatesRef = _this.getTemplatesRef();
    _this.vecticPalettesRef = _this.getPalettesRef();
    _this.setVecticHooks();
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
  };

  // Settings hook handlers
  this.settingsChange = function(snapshot) {
    var val = snapshot.val();
    if(!(val && val.width && val.height)) {return console.error('vectic settingsChange: missing width/height');}

    var viewBox = '0 0 '+val.width+' '+val.height;
    _this.targetObjectSvg.setAttributeNS(null, 'viewBox', viewBox);
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
      vecticid: _this.vecticID,
      target: templateDom,
      path: _this.pathTemplate,
    });
  };

  this.newTemplateDom = function(key) {
    return $('<svg id="t'+key+'"></svg>');
  };

  // Palette hook handlers
  this.initPalette = _vectic_palette;      // Set as pointer for easy test mocking
  this.addPalette = function(fbRef, prevKey) {
    var key = fbRef.key();
    var data = fbRef.val();

    var paletteid = data.palette;
    var paletteDom = _this.newPaletteDom(key);
    if(_this.paletteContainerDom) {$(_this.paletteContainerDom).append(paletteDom);}

    if(_this.vecticPaletteHandlers[key]) {_this.vecticPaletteHandlers[key].destroy();}
    _this.vecticPaletteHandlers[key] = new _this.initPalette({
      id: paletteid,
      vecticid: _this.vecticID,
      target: paletteDom,
      path: _this.pathPalette,
    });
  };

  this.newPaletteDom = function(key) {
    return $('<style id="p'+key+'"></style>');
  };
}