import $ from 'jquery';
import _ from 'underscore';
import is_int from 'locutus/php/var/is_int';
// import escape from 'validator/lib/escape';
import {Utils} from './utils';

/**
 * Sanitize string
 *
 * @since 1.0.0
 * @param mixed                $input   The value to sanitize.
 * @return string The sanitized value.
 */
export function string ($input) {
  if (!_.isString($input)) {
    return JSON.stringify($input);
  }
  return $input;
}

/**
 * Sanitize array
 *
 * @since 1.0.0
 * @param mixed                $input   The value to sanitize.
 * @return array The sanitized value.
 */
export function array ($input) {
  let sanitized = [];
  let inputAsArray = $input;

  // in the edge case it comes as a stringified array
  if (_.isString($input)) {
    try {
      inputAsArray = JSON.parse($input);
    } catch(e) {
      inputAsArray = $input;
    }
  }

  // coerce in any case to an array, the rest will be dealt during validation
  if (!_.isArray(inputAsArray)) {
    inputAsArray = [$input];
  }

  for (let i = 0; i < inputAsArray.length; i++) {
    sanitized.push(string(inputAsArray[i]));
  }

  return sanitized;
}

/**
 * Sanitize hex color
 * check for a hex color string like '#c1c2b4' or '#c00' or '#CCc000' or 'CCC'
 *
 * It needs a value cleaned of all whitespaces (sanitized).
 *
 * @since  1.0.0
 * @param  string $input  The input value to sanitize
 * @return string|boolean The sanitized input or `false` in case the input
 *                        value is not valid.
 */
export function hex( $input ) {
  if ( $input.match( /^([A-Fa-f0-9]{3}){1,2}$/ ) ) {
    return `#${$input}`;
  }
  return $input;
}

/**
 * Sanitize single choice
 *
 * @since 1.0.0
 * @param string               $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return string The sanitized value.
 */
export function singleChoice ($value, $setting, $control) {
  return string($value);
}

/**
 * Sanitize multiple choices
 *
 * @since 1.0.0
 * @param array                $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return array The sanitized value.
 */
export function multipleChoices($value, $setting, $control) {
  return array($value);
}

/**
 * Sanitize one or more choices
 *
 * @since 1.0.0
 * @param mixed                $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return array The sanitized value.
 */
export function oneOrMoreChoices ($value, $setting, $control) {
  if (_.isArray($value)) {
    if ($value.length === 1) {
      return $value[0];
    }
    return $value;
  }
  if (_.isString($value)) {
    return $value;
  }
  return [JSON.stringify($value)];
}

/**
 * Sanitize font family
 *
 * @since  1.0.0
 * @param string|array         $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return string|array The sanitized value.
 */
export function fontFamily( $value ) {
  let $sanitized = [];

  if ( _.isString( $value ) ) {
    $value = $value.split(',');
  }
  if ( _.isArray( $value ) ) {
    for (let i = 0; i < $value.length; i++) {
      $sanitized.push(Utils.normalizeFontFamily($value[i]));
    }
    $sanitized = $sanitized.join(',');
  }
  return $sanitized;
}

/**
 * Sanitize checkbox
 *
 * @since 1.0.0
 * @override
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return mixed
 */
export function checkbox( $value, $setting, $control ) {
  return Boolean( $value ) ? '1' : '0';
}

/**
 * Sanitize tags
 *
 * @since 1.0.0
 * @param mixed                $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return boolean The sanitized value.
 */
export function tags( $value, $setting, $control ) {
  if (_.isString($value )) {
    $value = $value.split(',');
  }
  if (!_.isArray($value)) {
    $value = [string($value)];
  }
  $value = _.map($value, value => { return value.trim() });
  $value = _.unique($value);

  // if ( isset( $control->max ) ) {
  //  $max_items = filter_var( $control->max, FILTER_SANITIZE_NUMBER_INT );

  //  if ( count( $value ) > $max_items ) {
  //    $value = array_slice( $value, $max_items );
  //  }
  // }
  return $value.join(',');
  // return Utils.stripHTML($value.join(','));
}

/**
 * Sanitize text
 *
 * @since 1.0.0
 * @param mixed                $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return boolean The sanitized value.
 */
export function text( $value, $setting, $control ) {
  const $attrs = $control.params.attrs;
  const $input_type = $attrs.type || 'text';

  $value = string( $value );

  // url
  if ( 'url' === $input_type ) {
    $value = $value.trim(); // @@todo: something like: `esc_url_raw( $value );` \\
  }
  // email
  else if ( 'email' === $input_type ) {
    $value = $value.trim(); // @@todo: something like: `sanitize_email( $value );` \\
  }
  // max length
  if ( is_int( $attrs['maxlength'] ) && $value.length > $attrs['maxlength'] ) {
    $value = $value.substr( 0, $attrs['maxlength'] );
  }

  return $value;
  // return Utils.stripHTML($value);
}

/**
 * Exports the `Sanitize` object
 */
export default {
  singleChoice,
  oneOrMoreChoices,
  multipleChoices,
  checkbox,
  fontFamily,
  tags,
  text,
};
