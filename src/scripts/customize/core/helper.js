/**
 * @fileOverview An helper class containing helper methods. This has its PHP
 * equivalent in `class-helper.php`
 *
 * @module Helper
 * @requires tinycolor
 */
import strpos from 'locutus/php/strings/strpos';
import is_int from 'locutus/php/var/is_int';
import is_float from 'locutus/php/var/is_float'
/* global tinycolor */

/**
 * Is setting value (`control.setting()`) empty?
 *
 * Used to check if required control's settings have instead an empty value
 *
 * @see php class method `KKcp_Validate::is_empty()`
 * @param  {string}  value
 * @return {bool}
 */
export function isEmpty (value) {
  // first try to compare it to empty primitives
  if (value === null || value === undefined || value === '') {
    return true;
  } else {
    // if it's a jsonized value try to parse it
    try {
      value = JSON.parse(value);
    } catch(e) {}

    // and then see if we have an empty array or an empty object
    if ((_.isArray(value) || _.isObject(value)) && _.isEmpty(value)) {
      return true;
    }

    return false;
  }
}

/**
 * Is keyword color?
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 *
 * @since  1.0.0
 *
 * @param  {string} $value  The value value to check
 * @return bool
 */
export function isKeywordColor( $value ) {
  const keywords = api.constants['colorsKeywords'] || [];
  return keywords.indexOf( $value ) !== -1;
}

/**
 * Is HEX color?
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 *
 * @since  1.0.0
 *
 * @param  {string} $value  The value value to check
 * @return {bool}
 */
export function isHex( $value ) {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test( $value )
}

/**
 * Is RGB color?
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 * Inspired by formvalidation.js by Nguyen Huu Phuoc, aka @nghuuphuoc
 * and contributors {@link https://github.com/formvalidation/}.
 *
 * @since  1.0.0
 *
 * @param  {string} $value  The value value to check
 * @return {bool}
 */
export function isRgb( $value ) {
  const regexInteger = /^rgb\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){2}(\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*)\)$/;
  const regexPercent = /^rgb\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/;
  return regexInteger.test( $value ) || regexPercent.test( $value );
}

/**
 * Is RGBA color?
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 * Inspired by formvalidation.js by Nguyen Huu Phuoc, aka @nghuuphuoc
 * and contributors {@link https://github.com/formvalidation/}.
 *
 * @since  1.0.0
 *
 * @param  {string} $value  The value value to check
 * @return {bool}
 */
export function isRgba( $value ) {
  const regexInteger = /^rgba\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
  const regexPercent = /^rgba\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
  return regexInteger.test( $value ) || regexPercent.test( $value );
}

// hsl: return /^hsl\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/.test(value);
// hsla: return /^hsla\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/.test(value);

/**
 * Is a valid color among the color formats given?
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 *
 * @since  1.0.0
 *
 * @param  {string} $value           The value value to check
 * @param  {Array} $allowed_formats  The allowed color formats
 * @return {bool}
 */
export function isColor ( $value, $allowedFormats ) {
  for (var i = 0; i < $allowedFormats.length; i++) {
    let $format = $allowedFormats[i];

    if ( $format === 'keyword' && isKeywordColor( $value ) ) {
      return true;
    }
    else if ( $format === 'hex' && isHex( $value ) ) {
      return true;
    }
    else if ( $format === 'rgb' && isRgb( $value ) ) {
      return true;
    }
    else if ( $format === 'rgba' && isRgba( $value ) ) {
      return true;
    }
  }

  return false;
}

/**
 * Convert a hexa decimal color code to its RGB equivalent
 *
 * @link(http://php.net/manual/en/function.hexdec.php#99478, original source)
 * @since  1.0.0
 * @param  {string} $value          Hexadecimal color value
 * @param  {bool}   $returnAsString If set true, returns the value separated by
 *                                  the separator character. Otherwise returns an
 *                                  associative array.
 * @return {array|string} Depending on second parameter. Returns `false` if
 *                        invalid hex color value
 */
export function hexToRgb( $value, $returnAsString = true ) {
  return $returnAsString ? tinycolor.toRgbString( $value ) : tinycolor.toRgb( $value );
}

/**
 * Converts a RGBA color to a RGB, stripping the alpha channel value
 *
 * It needs a value cleaned of all whitespaces (sanitized).
 *
 * @method
 * @since  1.0.0
 * @param  {string} $input
 * @return ?string
 */
export const rgbaToRgb = hexToRgb;

/**
 * Normalize font family.
 *
 * Be sure that a font family is wrapped in quote, good for consistency
 *
 * @since  1.0.0
 *
 * @param  {string} $value
 * @return {string}
 */
export function normalizeFontFamily( $value ) {
  $value = $value.replace(/'/g, '').replace(/"/g, '');
  return `'${$value.trim()}'`;
}

/**
 * Normalize font families
 *
 * Be sure that one or multiple font families are all trimmed and wrapped in
 * quotes, good for consistency
 *
 * @since  1.0.0
 *
 * @param {string|array} $value
 * @return {string|null}
 */
export function normalizeFontFamilies( $value ) {
  let $sanitized = [];

  if ( _.isString( $value ) ) {
    $value = $value.split(',');
  }
  if ( _.isArray( $value ) ) {
    for (var i = 0; i < $value.length; i++) {
      $sanitized.push( normalizeFontFamily( $value[i] ));
    }
    return $sanitized.join(',');
  }

  return null;
}

/**
 * Extract number from value, returns 0 otherwise
 *
 * @since  1.0.0
 * @param  {string}         $value         The value from to extract from
 * @param  {bool|null}      $allowed_float Whether float numbers are allowed
 * @return {int|float|null} The extracted number or null if the value does not
 *                          contain any digit.
 */
export function extractNumber( $value, $allowed_float ) {
  let $number_extracted;

  if ( is_int( $value ) || ( is_float( $value ) && $allowed_float ) ) {
    return $value;
  }
  if ( $allowed_float ) {
    $number_extracted = parseFloat( $value ); // filter_var( $value, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION );
  } else {
    $number_extracted = parseInt( $value, 10 ); // filter_var( $value, FILTER_SANITIZE_NUMBER_INT );
  }
  if ( $number_extracted || 0 === $number_extracted ) {
    return $number_extracted;
  }
  return null;
}

/**
 * Extract unit (like `px`, `em`, `%`, etc.) from an array of allowed units
 *
 * @since  1.0.0
 * @param  {string}     $value          The value from to extract from
 * @param  {null|array} $allowed_units  An array of allowed units
 * @return {string}                     The first valid unit found.
 */
export function extractSizeUnit( $value, $allowed_units ) {
  if ( _.isArray( $allowed_units ) ) {
    for (let i = 0; i < $allowed_units.length; i++) {
      if ( strpos( $value, $allowed_units[i] ) ) {
        return $allowed_units[i];
      }
    }
    return $allowed_units[0] || '';
  }
  return '';
}

/**
 * Modulus
 *
 * @source https://stackoverflow.com/a/31711034
 * @param  {number} val
 * @param  {number} step
 * @return {number}
 */
export function modulus(val, step){
  let valDecCount = (val.toString().split('.')[1] || '').length;
  let stepDecCount = (step.toString().split('.')[1] || '').length;
  let decCount = valDecCount > stepDecCount? valDecCount : stepDecCount;
  let valInt = parseInt(val.toFixed(decCount).replace('.',''));
  let stepInt = parseInt(step.toFixed(decCount).replace('.',''));
  return (valInt % stepInt) / Math.pow(10, decCount);
}

/**
 * Is Multiple of
 *
 * Take a look at the {@link http://stackoverflow.com/q/12429362/1938970
 * stackoverflow question} about this topic. This solution is an ok
 * compromise. We use `Math.abs` to convert negative number to positive
 * otherwise the minor comparison would always return true for negative
 * numbers.
 *
 * This could be a valid alternative to the above `modulus` function.
 * Note that unlike `modulus` the return value here is a boolean.
 *
 * @ignore
 * @param  {string}  val
 * @param  {string}  step
 * @return {bool}
 */
export function isMultipleOf (val, step) {
  var a = Math.abs(val);
  var b = Math.abs(step);
  var result = Math.round( Math.round(a * 100000) % Math.round(b * 100000) ) / 100000;
  return result < 1e-5;
}

/**
 * To Boolean
 * '0' or '1' to boolean
 *
 * @static
 * @param  {string|number} value
 * @return {bool}
 */
export function numberToBoolean (value) {
  return typeof value === 'boolean' ? value : !!parseInt(value, 10);
}

/**
 * Strip HTML from value
 * {@link http://stackoverflow.com/q/5002111/1938970}
 *
 * @static
 * @param  {string} value
 * @return {string}
 */
export function stripHTML (value) {
  return $(document.createElement('div')).html(value).text();
}

/**
 * Does string value contains HTML?
 *
 * This is just to warn the user, actual sanitization is done backend side.
 *
 * @see https://stackoverflow.com/a/15458987
 * @param  {string}  value
 * @return {bool}
 */
export function hasHTML (value) {
  return /<[a-z][\s\S]*>/i.test(value);
}

/**
 * Is HTML?
 *
 * It tries to use the DOMParser object (see Browser compatibility table
 * [here](mzl.la/2kh7HEl)), otherwise it just.
 * Solution inspired by this {@link http://bit.ly/2k6uFLI, stackerflow answer)
 *
 * Not currently in use.
 *
 * @ignore
 * @param  {string}  str
 * @return {bool}
 */
export function isHTML (str) {
  if (window.DOMParser) {
    try {
      var doc = new window.DOMParser().parseFromString(str, 'text/html');
      return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    } catch (e) {}
  } else {
    return false;
  }
}

/**
 * @alias core.Helper
 * @description  Exposed module <a href="module-Helper.html">Helper</a>
 * @access package
 */
export default {
  isEmpty,
  isHex,
  isRgb,
  isRgba,
  isColor,
  hexToRgb,
  rgbaToRgb,
  normalizeFontFamily,
  normalizeFontFamilies,
  extractSizeUnit,
  extractNumber,
  modulus,
  // These don't have a PHP equivalent in the KKcp_Helper class:
  numberToBoolean,
  stripHTML,
  hasHTML,
}