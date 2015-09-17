/* jshint unused: false */

(function (window, $, wp, api) {
  'use strict';

  // be sure to have what we need, bail otherwise
  if (!api || !wp) {
    return;
  }
  var wpApi = wp.customize;

  /**
   * Customize Plus API constants
   * @type {Object}
   */
  var constants = api.constants;

  /**
   * To CSS
   * Helper to append a piece of CSS for a specific option changed
   * @param  {string} id       Setting ID / Variable name
   * @param  {string} property CSS property name
   * @param  {string} value    CSS value
   * @param  {string} selector Selector to apply propert value css pair
   */
  api.toCSS = function (id, property, value, selector) {
    if (!value || !selector) {
      return;
    }
    var idFinal = 'pwpcp-style-' + id;
    var css = selector + '{' + property + ':' + value + '};';
    var oldCSS = document.getElementById(idFinal);
    if (oldCSS) {
      oldCSS.innerHTML = css;
    } else {
      var style = document.createElement('style');
      style.id = idFinal;
      style.innerHTML = css;
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);
    }
  };

  /**
   * Get option id
   * GIven a simple setting id saved through the WordPress Settings API it
   * returns the real id with the right theme prefix
   * @param  {String} settingId The setting id in its short form
   * @return {String} The actual setting id as saved in the database under a
   *                  common namespace (theme settings prefix)
   */
  api.getOptionId = function (settingId) {
    return constants.SETTINGS_PREFIX + '[' + settingId + ']';
  };

})(window, jQuery, wp, PWPcp);
