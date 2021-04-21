/**
 * Tests a single element for visibility within the viewport.
 * @param {*} el 
 * @param {*} tolerance 
 * @returns true or false
 */
const isTheElementInViewPort = (el, tolerance = 0) => {
  var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  var viewportTop = tolerance * viewportHeight;
  var viewportBottom = viewportHeight - viewportTop;

  var whereisCurrentElement = el.getBoundingClientRect();

  var isCurrentElementInView = (whereisCurrentElement.top >= viewportTop && whereisCurrentElement.top <= viewportBottom) ||
    (whereisCurrentElement.bottom >= viewportTop && whereisCurrentElement.bottom <= viewportBottom)

  return isCurrentElementInView;
}

/**
 * Tests all tracked elements, and invokes callback for visible elements:
 */
const callElementsInViewport = () => {
  for (var i = elements.length - 1; i >= 0; i--) {
    var trackableElement = elements[i];
    if (isTheElementInViewPort(trackableElement.el)) {
      var keep = trackableElement.fn.call(null, trackableElement.el);
      if (!keep) elements.splice(i, 1);
    }
  }
}

/**
 * Adds an element to the trackable queue.
 * @param {*} el 
 * @param {*} fn 
 * @param {*} tolerance 
 */
const trackElement = (el, fn, tolerance) => {
  var keep = true;

  // Test if element is already in viewport.
  // if so, callback immediately:
  if (isTheElementInViewPort(el, tolerance)) {
    keep = fn(el);
  }

  // If we're keeping the element even after calling it,
  // then add it into the queue:
  if (keep) {
    els.push({
      el: el,
      fn: fn,
      t: tolerance
    });

    // Initialize scroll tracking:
    // (this will only allow itself to run once)
    if (!_init) {
      _init = true;
      window.addEventListener('scroll', _.throttle(callElementsInViewport, 200, this));
      window.addEventListener('resize', _.throttle(refresh, 200, this));
    }
  }
}

/**
 * Refreshes the viewport by clearing cached dimensions,
 * and then re-checking all elements.
 */
const refresh = () => {
  callElementsInViewport();
}
