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
