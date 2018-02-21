<?php // @partial
/**
 * Font Family Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Font_Family extends KKcp_Customize_Control_Base_Set {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_font_family';

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $max = 10;

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $choices = array( 'standard' );

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected $supported_sets = array(
		'standard',
	);

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected $set_js_var = 'fontFamiliesSets';

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	protected function get_set ( $name ) {
		if ( $name === 'standard' ) {
			return KKcp_Data::get_font_families_standard();
		}

		return [];
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function get_valid_choices ( $filtered_sets ) {
		$valid_choices = parent::get_valid_choices( $filtered_sets );

		foreach ( $valid_choices as $valid_choice ) {
			array_push( $valid_choices, KKcp_Helper::normalize_font_family( $valid_choice ) );
		}

		return $valid_choices;
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
		</label>
		<input class="kkcp-selectize" type="text" required>
		<?php
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::font_family( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::font_family( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Font_Family' );