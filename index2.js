var _vecticUID = 0;

var _htmlBoiler = '\
<span class="svg`tainer">\
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

var _dataWrapperItems = {};   // dataWrapper() objects refered by: '{type}_{id}'. e.g. 'template_abcd01'

var _vecticTags = [
  'circle',
  'rect',
];
var _vecticTagAttributes = [{
  id: 'id',     val: function(data, key) { return 't'+key; } },{
  id: 'objid',  val: function(data, key) { return key; } },{
  id: 'class',  val: function(data, key) { return 'c'+data.color; } },{
  id: 'r',      val: function(data, key) { return data.r; } },{
  id: 'cx',     val: function(data, key) { return data.cx; } },{
  id: 'cy',     val: function(data, key) { return data.cy; } },{
  id: 'x',      val: function(data, key) { return data.x; } },{
  id: 'y',      val: function(data, key) { return data.y; } },{
  id: 'width',  val: function(data, key) { return data.width; } },{
  id: 'height', val: function(data, key) { return data.height; } },];

function vectic(vecticParams) {
  vecticParams = vecticParams || {};
  var _vectic = this;
  _vectic.id = vecticParams.id;
  _vectic.type = vecticParams.type || 'vectic';

  // TODO: Use dataWrapper?
  _vectic.rootID = 'v'+this.vecticID+'_id'+(_vecticUID+=1);
  _vectic.rootElementId = null;
  _vectic.targetObject = vecticParams.target;

  _vectic.objectContainerDom = null;          // Vectic DOM object (set in _vectic.getDoms)
  _vectic.templateContainerDom = null;        // Vectic DOM object (set in _vectic.getDoms)
  _vectic.paletteContainerDom = null;         // Vectic DOM object (set in _vectic.getDoms)
  _vectic.templateEditContainerDom = null;    // Vectic DOM object (set in _vectic.getDoms)

  _vectic.Firebase = Firebase;
  if(!_vectic.Firebase) { return console.error('vectic(): could not find Firebase library'); }

  _vectic.pathBase = vecticParams.basePath || 'http://vecticdev.firebaseio.com/';
  _vectic.firebaseRef = null;

  _vectic.connect = function() {
    _vectic.firebaseRef = new _vectic.Firebase(_vectic.pathBase);
  };

  _vectic.initStyles = function() {
    console.log('_vectic.initStyles')
    // Add css styles and reusable content to <body> if not already added
    if($('body #vecticStyler').length) {return;}

    var vecticStyler = $('<style id="vecticStyler">'+_globalVecticStyler+'</style>');
    $('body').append(vecticStyler);
  };

  _vectic.initHTML = function() {
    console.log('_vectic.initHTML')
    if(!_vectic.targetObject) {return console.error('vectic: Target object missing');}
    _vectic.targetObject.html(_htmlBoiler.replace('{{ROOTID}}', _vectic.rootID));
    // TODO: replace w=this with the dataWrapper?
    _vectic.targetObjectSvg = ($(_vectic.targetObject)).find('svg').get(0);
  };

  _vectic.getDoms = function() {
    console.log('_vectic.getDoms')
    _vectic.objectContainerDom        = $('svg#'+_vectic.rootID+' g#objects').get(0);
    _vectic.templateContainerDom      = $('svg#'+_vectic.rootID+' defs#templates').get(0);
    _vectic.paletteContainerDom       = $('svg#'+_vectic.rootID+' defs#palettes').get(0);
    _vectic.templateEditContainerDom  = $('svg#'+_vectic.rootID+' g#templates_edit').get(0);
  };

  _vectic.dataWrapper = function(dataWrapperParams) {
    dataWrapperParams = dataWrapperParams || {};
    var _dataWrapper = this;

    _dataWrapper.id = dataWrapperParams.id;
    _dataWrapper.type = dataWrapperParams.type;
    _dataWrapper.elementId = null;      // HTML DOM Object ID
    _dataWrapper.element = null         // HTML DOM Object (JQuery)
    _dataWrapper.ref = null;            // Firebase connection reference
    _dataWrapper.val = null;            // Snapshot data

    _dataWrapper.redraw = function() {
      if(!_dataWrapper.val) {
        console.error('_dataWrapper.redraw(): no val available');
      }
      
      var newElement = null;
      // TODO: Create DOM Object
      switch(_dataWrapper.type) {
        case 'vectic':
          // TODO:
          break;
        case 'template':
          newElement = document.createElementNS('http://www.w3.org/2000/svg', ('def'));
          if(_dataWrapper.element) {
            // TODO: copy existing internal content to new newElement content
          }
          break;
        case 'palette':
          // TODO:
          break;
        case 'object':
          newElement = document.createElementNS('http://www.w3.org/2000/svg', ('use'));
          if(_dataWrapper.element) {
            // TODO: copy existing internal content to new newElement content
          }
          // TODO:
          break;
      }

      // TODO: ^ Above: Add default behaviour (exit without redrawing with error)

      // TODO: Insert inner text from _dataWrapper.val

      // TODO: Apply attributes from _dataWrapper.val

      // TODO: DOM Object to corresponding container DOM element (which triggers html redraw)
      switch(_dataWrapper.type) {
        case 'vectic':
          // TODO:
          break;
        case 'template':
          if(_dataWrapper.element) { _dataWrapper.element.replaceWith(newElement); }      // Replace existing element
          else if(_vectic.templateContainerDom) { _vectic.templateContainerDom.append(newElement); }    // Append new object
          else { console.error('_dataWrapper.redraw(): type="'+_dataWrapper.type+'": nowhere to draw'); }
          _dataWrapper.element = newElement;
          break;
        case 'palette':
          // TODO:
          break;
        case 'object':
          if(_dataWrapper.element) { _dataWrapper.element.replaceWith(newElement); }      // Replace existing element
          else if(_vectic.objectContainerDom) { _vectic.objectContainerDom.append(newElement); }    // Append new object
          else { console.error('_dataWrapper.redraw(): type="'+_dataWrapper.type+'": nowhere to draw'); }
          _dataWrapper.element = newElement;
          // TODO:
          break;
      }
    }

    // Decide on data path and html element ID based on type
    switch(_dataWrapper.type) {
      case 'vectic':
        _dataWrapper.elementId = 'v'+_dataWrapper.id;
        _dataWrapper.path = 'vectic/'+_dataWrapper.id;
        break;
      case 'template':
        _dataWrapper.elementId = 't'+_dataWrapper.id;
        _dataWrapper.path = 'template/'+_dataWrapper.id;
        break;
      case 'palette':
        _dataWrapper.elementId = 'p'+_dataWrapper.id;
        _dataWrapper.path = 'palette/'+_dataWrapper.id;
        break;
      case 'object':
        _dataWrapper.elementId = 'o'+_dataWrapper.id;
        _dataWrapper.path = 'object/'+_dataWrapper.id;
        break;
    }

    // Connect to database object
    if(_vectic.firebaseRef && _dataWrapper.path) {
      _dataWrapper.ref = _vectic.firebaseRef.child(_dataWrapper.path);

      _dataWrapper.ref.on('value', function(snapshot) {
        _dataWrapper.val = snapshot;
        _dataWrapper.redraw();
      });
    }

    if(_dataWrapper.elementId) {
      // TODO:
    }
    
    if(!_dataWrapper.id) { return console.error('vectic.dataWrapper() missing "id" parameter'); }
    if(!_dataWrapper.type) { return console.error('vectic.dataWrapper() missing "type" parameter'); }
    if(!_dataWrapper.elementId) { return console.error('vectic.dataWrapper() missing "elementId"'); }

    // TODO:
    _dataWrapperItems[_dataWrapper.elementId] = _dataWrapper;
  };

  _vectic.init = function() {
    if(!_vectic.Firebase) {return console.error('vectic.init(): Missing Firebase library');}
    _vectic.initStyles();
    _vectic.initHTML();
    _vectic.getDoms();

    if(_vectic.id) {
      // TODO: 
      var newWrapper = new _vectic.dataWrapper({
        id: _vectic.id,
        type: 'vectic',
      });
    }

    // TODO:
  };

  _vectic.getObjectsRef = function() {
    console.log('TODO: Stop calling _vectic.getObjectsRef! OR, you know, code this function');
  };
}