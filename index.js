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


function vectic(params) {
  // Define
  params = params || {};
  var _this = this;
  this.targetObject = params.target;
  this.vecticID = params.vecticID;
  this.firebaseLib = undefined;
  this.vecticRef = undefined;
  this.objects = {};
  this.templates = {};
  this.palettes = {};
  this.objectContainerDom = null;
  this.templateContainerDom = null;
  this.paletteContainerDom = null;

  // Get Firebase if available
  if(typeof Firebase != 'undefined') {
    this.firebaseLib = Firebase;
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

    _this.vecticObjectsRef.off('child_added', _this.addObject, _this.refError);
    _this.vecticTemplatesRef.off('child_added', _this.addTemplate, _this.refError);
    _this.vecticPalettesRef.off('child_added', _this.addPalette, _this.refError);

    _this.vecticObjectsRef.on('child_added', _this.addObject, _this.refError);
    _this.vecticTemplatesRef.on('child_added', _this.addTemplate, _this.refError);
    _this.vecticPalettesRef.on('child_added', _this.addPalette, _this.refError);
  };

  // Object hook handlers
  this.newObjectDom = function(key) {
    return $('<use id="'+key+'"></use>');
  };
  this.addObject = function(fbRef, prevKey) {
    var key = fbRef.key();
    var data = fbRef.val();
    // _this.objects[key] = data;
    var objectDom = _this.newObjectDom(key);
    if(_this.objectContainerDom) {$(_this.objectContainerDom).append(objectDom);}
    _this.setObjectAttributes(objectDom.get(0), data);
  };

  this.setObjectAttributes = function(objectDom, data) {
    objectDom.setAttributeNS('xlink', 'xlink:href', '#'+data.template);
    objectDom.setAttributeNS(null, 'x', data.x || null);
    objectDom.setAttributeNS(null, 'y', data.y || null);
    objectDom.setAttributeNS(null, 'width', data.width || null);
    objectDom.setAttributeNS(null, 'height', data.height || null);
  };

  this.addTemplate = function(fbRef, prevKey) {
    var key = fbRef.key();
    var data = fbRef.val();
    // TODO:
    // _this.templates[key] = data;
    // _this.templateContainerDom
  };

  this.addPalette = function(fbRef, prevKey) {
    var key = fbRef.key();
    var data = fbRef.val();
    // TODO:
    // _this.palettes[key] = data;
    // _this.paletteContainerDom
  };

  // TODO:

  this.refError = function() {
    // TODO: hanle Firebase reference hook errors
  };
}