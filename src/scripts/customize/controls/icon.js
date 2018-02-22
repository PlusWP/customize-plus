import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import BaseSet from './base-set';

/**
 * Control Icon
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_icon`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Icon
 *
 * @extends controls.BaseSet
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class Icon extends BaseSet {

  /**
   * @override
   */
  _renderItem (data) {
    return `<div class="kkcp-icon-selectItem kkcpui-tooltip--top" title="${_.escape(data.value)}">
        <i class="${_.escape(this._getIconClassName(data))}"></i>
      </div>`;
  }

  /**
   * @override
   */
  _renderOption (data) {
    return `<div class="kkcp-icon-selectOption kkcpui-tooltip--top" title="${_.escape(data.value)}">
        <i class="${_.escape(this._getIconClassName(data))}"></i>
      </div>`;
  }

  /**
   * @override
   */
  _renderGroupHeader (data) {
    return `<div class="kkcp-icon-selectHeader">${_.escape(data.label)}</div>`;
  }

  /**
   * Get option icon class name
   *
   * @since   1.0.0
   * @memberof! controls.Icon#
   * @access protected
   *
   * @param  {Object} data The single option data
   * @return {string}
   */
  _getIconClassName (data) {
    return `${data.set} ${data.set}-${data.value}`;
  }
}

export default wpApi.controlConstructor['kkcp_icon'] = api.controls.Icon = Icon;