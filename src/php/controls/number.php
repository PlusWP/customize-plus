<?php // @partial
/**
 * Number Control custom class
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
class KKcp_Customize_Control_Number extends KKcp_Customize_Control_Base {

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	public $type = 'kkcp_number';

	/**
	 * @since 1.0.0
	 * @ineritDoc
	 */
	protected $allowed_input_attrs = array(
		'tooltip' => array( 'sanitizer' => 'string' ),
		'float' => array( 'sanitizer' => 'bool' ),
		'min' => array( 'sanitizer' => 'number' ),
		'max' => array( 'sanitizer' => 'number' ),
		'step' => array( 'sanitizer' => 'number' ),
		// 'pattern' => array( 'sanitizer' => 'string' ),
	);

	/**
	 * @since  1.0.0
	 * @inerhitDoc
	 */
	public function get_l10n() {
		return array(
			'vNotAnumber' => esc_html__( 'It must be a number' ),
			'vNoFloat' => esc_html__( 'It must be an integer, not a float' ),
			'vNotAnInteger' => esc_html__( 'It must be an integer number' ),
			'vNumberStep' => esc_html__( 'It must be a multiple of **%s**' ),
			'vNumberLow' => esc_html__( 'It must be higher than **%s**' ),
			'vNumberHigh' => esc_html__( 'It must be lower than **%s**' ),
		);
	}

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::number( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::number( $validity, $value, $setting, $control );
	}
}

// Register on WordPress Customize global object
$wp_customize->register_control_type( 'KKcp_Customize_Control_Number' );