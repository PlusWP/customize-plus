import { api, wpApi } from '../core/globals';
import { numberToBoolean } from '../core/helper';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import ControlBase from './base';

/**
 * Control Checkbox
 *
 * @class api.controls.Checkbox
 * @alias wp.customize.controlConstructor.kkcp_checkbox
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class ControlCheckbox extends ControlBase {

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
  softenize (value) {
    return (value === 0 || value === 1) ? value.toString() : value;
  }

  /**
   * @override
   */
  validate (value) {
    return Validate.checkbox({}, value, this.setting, this);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.checkbox(value, this.setting, this);
  }

  /**
   * @override
   */
  syncUI (value) {
    const valueClean = numberToBoolean(value);
    const inputStatus = numberToBoolean(this.__input.checked);
    if (inputStatus !== valueClean) {
      this.__input.checked = valueClean;
    }
  }

  /**
   * @override
   */
  ready () {
    this.__input = this._container.getElementsByTagName('input')[0];

    // sync input value on ready
    this.__input.checked = numberToBoolean(this.setting());

    // bind input on ready
    this.__input.onchange = function (event) {
      event.preventDefault();
      var value = event.target.checked ? 1 : 0;
      this.setting.set(value);
    }.bind(this);
  }
}

export default wpApi.controlConstructor['kkcp_checkbox'] = api.controls.Checkbox = ControlCheckbox;
