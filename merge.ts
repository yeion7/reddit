/**
 *
 * @param {string} x
 */
function _isObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}

/**
 *
 * @param {string} prop
 * @param {object} obj
 */
function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 *
 * @param {Function} fn
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 */
function mergeWithKey(fn, l, r) {
  var result = {};
  var k;

  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }

  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }

  return result;
}

/**
 * @see https://ramdajs.com/docs/#mergeDeepRight
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 */
export function mergeDeepRight(lObj, rObj) {
  return mergeWithKey(
    function(k, lVal, rVal) {
      if (Array.isArray(lVal) && Array.isArray(rVal)) {
        return [...lVal, ...rVal];
      }
      if (_isObject(lVal) && _isObject(rVal)) {
        return mergeDeepRight(lVal, rVal);
      } else {
        return rVal;
      }
    },
    lObj,
    rObj
  );
}
