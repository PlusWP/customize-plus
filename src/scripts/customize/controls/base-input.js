import $ from 'jquery';
import { api } from '../core/globals';
import ControlBase from './base';

/**
 * Control Base Input class
 *
 * @class api.controls.BaseInput
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class ControlBaseInput extends ControlBase {

  /**
   * Sync UI with value coming from API, a programmatic change like a reset.
   * @override
   * @param {string} value The new setting value.
   */
  syncUI (value) {
    // here value can be undefined if it doesn't pass the validate function
    if (value && this.__input.value !== value) {
      this.__input.value = value;
    }
  }

  /**
   * @override
   */
  ready () {
    var self = this;
    self.__input = self._container.getElementsByTagName('input')[0];

    // sync input and listen for changes
    $(self.__input)
      .val(self.setting())
      .on('change keyup paste', function () {
        self.setting.set(this.value);
      });
  }
}

export default api.controls.BaseInput = ControlBaseInput;
