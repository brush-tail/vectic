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


function vectic(params) {

  // Define
  params = params || {};
  this.targetObject = params.target;
  this.vecticID = params.vecticID;
  this.firebaseLib = undefined;
  if(typeof Firebase != 'undefined') {
    this.firebaseLib = Firebase;
  }

  if(!this.targetObject) {return console.error('vectic(): missing target jQuery object');}
  if(!this.vecticID) {return console.error('vectic(): missing vecticID');}

  // Generate unique ID to distinguish each vectic object within interface
  this.rootID = 'v'+this.vecticID+'_id'+(_vecticUID+=1);

  // init() is triggered separately so jasmine tests can watch internal functions for testing purposes
  this.init = function() {
    this.initHTML();
    this.initFirebase();
  };

  // Sets internal static HTML
  this.initHTML = function() {
    if(!this.targetObject) {return console.error('vectic: Target object missing');}
    this.targetObject.html(_htmlBoiler);
  };

  this.initFirebase = function() {
    if(!this.firebaseLib) {return console.error('vectic: Missing Firbase library');}
    this.vecticRef = new this.firebaseLib();
  };

  // TODO:
}