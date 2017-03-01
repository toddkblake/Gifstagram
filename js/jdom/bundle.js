/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);

	const _docReadyCallbacks = [];

	window.$j = arg => {
	  switch (typeof(arg)) {
	    case 'function': {
	      return _handleCallback(arg);
	    }
	    case 'object': {
	      return _handleObject(arg);
	    }
	    case 'string': {
	      return _handleSelector(arg);
	    }
	  }
	}

	$j.ajax = options => {
	  const defaults = {
	    method: 'GET',
	    url: window.location.href,
	    data: {},
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    dataType: 'jsonp',
	    success: () => {},
	    error: () => {}
	  };

	  options = $j.extend(defaults, options);

	  return new Promise((resolve, reject) => {
	    const req = new XMLHttpRequest();

	    req.open(options.method, options.url);
	    req.setRequestHeader('Content-Type', options.contentType);
	    req.onload = function () {
	      if (req.status >= 200 && req.status < 300) {
	        if (options.dataType === 'jsonp') {
	          resolve(JSON.parse(req.response));
	        } else {
	          resolve(req.response);
	        }
	      } else {
	        reject(req.response);
	      }
	    }
	    req.onerror = () => reject(req.response);
	    req.send(JSON.stringify(options.data));
	  });
	};

	$j.extend = (...objects) => {
	  const result = {};
	  objects.forEach((object) => {
	    for (let key in object) {
	      result[key] = object[key];
	    }
	  });
	  return result;
	};

	// private

	_handleCallback = callback => {
	  if (document.readyState === 'complete') {
	    callback();
	  } else {
	    _docReadyCallbacks.push(callback);
	  }
	}

	_handleObject = object => {
	  if (object instanceof HTMLElement) {
	    return new DOMNodeCollection([object]);
	  }
	}

	_handleSelector = queryString => {
	  const nodes = [];
	  const nodeList = document.querySelectorAll(queryString);
	  nodeList.forEach(node => nodes.push(node));
	  return new DOMNodeCollection(nodes);
	}

	document.addEventListener('DOMContentLoaded', () => {
	  _docReadyCallbacks.forEach(callback => callback());
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(array) {
	    this.HTMLElements = array;
	  }

	  addClass(className) {
	    this.each(el => el.classList.add(className));
	  }

	  append(object) {
	    if (object instanceof DOMNodeCollection) {
	      object.HTMLElements.forEach(el => this.append(el));
	    } else if (object instanceof HTMLElement) {
	      this.each(el => el.appendChild(object));
	    } else {
	      this.each(el => el.innerHTML += object);
	    }
	  }

	  attr(attributeName, value) {
	    if (value) {
	      this.each((el) => {
	        el.setAttribute(attributeName, value);
	      });
	    } else {
	      this.HTMLElements[0].getAttribute(attributeName);
	    }
	  }

	  children() {
	    const children = [];
	    this.each((el) => {
	      const elChildren = el.children;

	      for (let i = 0; i < elChildren.length; i++) {
	        const childEl = elChildren[i];
	        children.push(childEl);
	      }
	    });

	    return new DOMNodeCollection(children);
	  }

	  each(callback) {
	    this.HTMLElements.forEach(callback);
	  }

	  empty() {
	    this.each(el => el.innerHTML = "");
	  }

	  find(selector) {
	    let results = [];
	    this.each((el) => {
	      const nodeList = el.querySelectorAll(selector);
	      nodeList.forEach(el => results.push(el));
	    });

	    return new DOMNodeCollection(results);
	  }

	  html(string) {
	    if (string) {
	      this.each(el => el.innerHTML = string);
	    } else {
	      return this.HTMLElements[0].innerHTML;
	    }
	  }

	  off(eventType, callback) {
	    if (!callback) callback = this.callback;
	    this.each((el) => {
	      el.removeEventListener(eventType, callback);
	    });
	  }

	  on(eventType, callback) {
	    this.each((el) => {
	      this.callback = callback;
	      el.addEventListener(eventType, callback);
	    });
	  }

	  parent() {
	    const parents = [];
	    this.each((el) => {
	      parents.push(el.parentNode);
	    });

	    return new DOMNodeCollection(parents);
	  }

	  remove(selector) {
	    this.each((el, i) => {
	      el.remove();
	      this.HTMLElements.splice(i, 1);
	    });
	  }

	  removeClass(className) {
	    this.each((el) => {
	      if (el.classList.contains(className)) {
	        el.classList.remove(className);
	      }
	    });
	  }

	  val(value) {
	    if (typeof value === 'string') {
	      this.each(el => el.value = value);
	    } else {
	      return this.HTMLElements[0].value;
	    }
	  }
	}

	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);