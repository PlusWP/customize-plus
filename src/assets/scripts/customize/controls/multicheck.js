/* global ControlBase */

/**
 * Control Multicheck
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
var ControlMulticheck = ControlBase.extend({
  /**
   * Validate
   *
   * @param  {string|array} newValue Value of the checkbox clicked
   * @return {string} A JSONified Array
   */
  _validate: function (rawNewValue) {
    var newValue;
    try {
      newValue = JSON.parse(rawNewValue);
    } catch (e) {
      newValue = rawNewValue;
    }
    var params = this.params;
    var lastValue = params.value;
    /**
     * Validate string
     * @return {string}
     */
    var _validateString = function () {
      var index = lastValue.indexOf(newValue);

      // if the checkbox ticked was in the last value array remove it
      if (index !== -1) {
        lastValue.splice(index, 1);
      // otherwise push it
      } else {
        // only if it is an allowed choice...
        if (params.choices[newValue]) {
          lastValue.push(newValue);
        }
      }
      //  otherwise just return the last value
      params.value = lastValue;
      return JSON.stringify(lastValue); // @@doubt not sure if it is a good idea
      // to stringify the setting and use params.value instead of
      // this.setting.get() where here above we get the last value \\
    };
    /**
     * Validate array
     * @return {string}
     */
    var _validateArray = function () {
      var validArray = [];
      var validArrayAsString;
      for (var i = 0; i < newValue.length; i++) {
        // only if it is an allowed choice...
        if (params.choices[ newValue[i] ]) {
          validArray.push( newValue[i] );
        }
      }
      validArrayAsString = JSON.stringify(validArray);
      params.value = validArrayAsString;
      return validArrayAsString;
    };
    // check type and do appropriate validation
    if (_.isString(newValue)) {
      return _validateString();
    } else if(_.isArray(newValue)){
      return _validateArray();
    } else {
      // @@todo maybe throws exception? \\
      return lastValue;
    }
  },
  /**
   * On initialization
   *
   * add custom validation function overriding the empty function from WP API.
   *
   * @override
   */
  onInit: function () {
    this.setting.validate = this._validate.bind(this);
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function (isForTheFirstTimeReady) {
    var params = this.params;
    var setting = this.setting;
    var inputs = this._container.getElementsByTagName('input');
    /**
     * Sync checkboxes and maybe bind change event
     * We need to be fast here, use vanilla js.
     *
     * @param  {boolean} bindAsWell Bind on change?
     */
    var _syncCheckboxes = function (bindAsWell) {
      var valueAsArray = params.value;
      for (var i = 0, l = inputs.length; i < l; i++) {
        var input = inputs[i];
        input.checked = valueAsArray.indexOf(input.value) !== -1;
        if (bindAsWell) {
          input.onchange = function (event) {
            setting.set(event.target.value);
          };
        }
      }
    };

    // sync checked state on checkboxes on ready and bind (argument `true`)
    _syncCheckboxes(true);

    // if the setting is changed programmatically (i.e. through code)
    // update checkboxes status
    if (isForTheFirstTimeReady) {
      this.setting.bind(function (value) {
        params.value = JSON.parse(value);
        _syncCheckboxes();
      });
    }
  }
});

wpApi['controlConstructor']['pwpcp_multicheck'] = ControlMulticheck;