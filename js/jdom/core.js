const DOMNodeCollection = require('./dom_node_collection.js');

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
