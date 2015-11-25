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

function vectic(vecticParams) {
  vecticParams = vecticParams || {};
  var _vectic = this;
  _vectic.id = vecticParams.id;
  _vectic.type = vecticParams.type || 'vectic';
  _vectic.rootElementId = null;
  _vectic.targetObject = vecticParams.target;

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
    _vectic.targetObjectSvg = ($(_vectic.targetObject)).find('svg').get(0);
  };

  _vectic.getDoms = function() {
    console.log('_vectic.getDoms')
    _vectic.objectContainerDom = $('svg#'+_vectic.rootID+' g#objects').get(0);
    _vectic.templateContainerDom = $('svg#'+_vectic.rootID+' defs#templates').get(0);
    _vectic.paletteContainerDom = $('svg#'+_vectic.rootID+' defs#palettes').get(0);
    _vectic.templateEditContainerDom = $('svg#'+_vectic.rootID+' g#templates_edit').get(0);
  };

  _vectic.dataWrapper = function(dataWrapperParams) {
    dataWrapperParams = dataWrapperParams || {};
    var _dataWrapper = this;

    _dataWrapper.id = dataWrapperParams.id;
    _dataWrapper.type = dataWrapperParams.type;
    _dataWrapper.rootElementId = _vectic.rootElementId;
    _dataWrapper.elementId = null;      // HTML DOM Object ID
    _dataWrapper.element = null         // HTML DOM Object (JQuery)
    _dataWrapper.ref = null;            // Firebase connection reference
    _dataWrapper.val = null;            // Snapshot data

    // Wrong, without angularfire we can't do this. Need to update .val on('value') changes
    // Object.defineProperty(_dataWrapper, 'val', {
    //   get: function() {
    //     if(_dataWrapper.ref) { return _dataWrapper.ref.val(); }
    //   },
    // });

    _dataWrapper.setVal = function(data) {
      _dataWrapper.val = data;
    };

    _dataWrapper.redraw = function() {
      if(!_dataWrapper.val) {
        console.error('_dataWrapper.redraw(): no val available');
      }
      
      // TODO: Create DOM Object
      switch(_dataWrapper.type) {
        case 'vectic':
          // TODO:
          break;
        case 'template':
          var newElement = document.createElementNS('http://www.w3.org/2000/svg', ('def'));
          if(_dataWrapper.element) { _dataWrapper.element.replaceWith(newElement); }
          else { /* TODO: Attach to parent object */ }
          _dataWrapper.element = newElement;
          break;
        case 'palette':
          // TODO:
          break;
        case 'object':
          var newElement = document.createElementNS('http://www.w3.org/2000/svg', ('use'));
          if(_dataWrapper.element) { _dataWrapper.element.replaceWith(newElement); }
          else { /* TODO: Attach to parent object */ }
          _dataWrapper.element = newElement;
          // TODO:
          break;
      }

      // TODO: Attach attributes to DOM Object

      // TODO: Insert inner text from _dataWrapper.val

      // TODO: Append child elements from _dataWrapper.element if available

      // TODO: DOM Object to corresponding container DOM element (which triggers html redraw)
      switch(_dataWrapper.type) {
        case 'vectic':
          // TODO:
          // $(templateEdit).append(output);
          break;
        case 'template':
          // TODO:
          // $(templateEdit).append(output);
          break;
        case 'palette':
          // TODO:
          // $(templateEdit).append(output);
          break;
        case 'object':
          _dataWrapper.element = document.createElementNS('http://www.w3.org/2000/svg', ('use'));
          // TODO:
          // $(templateEdit).append(output);
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
        _dataWrapper.setVal(snapshot);
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