import { api } from '../core/api';
import { wpApi } from '../core/globals';
import Utils from '../core/utils';
// import ControlBase from './base';

/**
 * Control Checkbox
 *
 * @class wp.customize.controlConstructor.pwpcp_checkbox
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires api.Utils
 */
let Control = api.controls.Base.extend({
  /**
   * Normalize setting for soft comparison
   *
   * We need this to fix situations like: `'1' === 1` returning false,
   * due to the fact that we can't use a real soft comparison (`==`).
   *
   * @override
   * @static
   * @param  {?} value Could be the factory, the initial, or the current
   *                   session value
   * @return {string} The 'normalized' value passed as an argument.
   */
  softenize: function (value) {
    return (value === 0 || value === 1) ? value.toString() : value;
  },
  /**
   * @override
   */
  validate: function (newValue) {
    return Utils._toBoolean(newValue) ? 1 : 0;
  },
  /**
   * @override
   */
  syncUI: function (value) {
    var valueClean = Utils._toBoolean(value);
    var inputStatus = Utils._toBoolean(this.__input.checked);
    if (inputStatus !== valueClean) {
      this.__input.checked = valueClean;
    }
  },
  /**
   * @override
   *
   * // @@doubt I could use `validator.toBoolean` \\
   */
  ready: function () {
    this.__input = this._container.getElementsByTagName('input')[0];

    // sync input value on ready
    this.__input.checked = Utils._toBoolean(this.setting());

    // bind input on ready
    this.__input.onchange = function (event) {
      event.preventDefault();
      var value = event.target.checked ? 1 : 0;
      this.setting.set(value);
    }.bind(this);
  }
});

export default wpApi.controlConstructor['pwpcp_checkbox'] = api.controls.Checkbox = Control;
