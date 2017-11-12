<?php // @partial
/**
 * Radio Image Control custom class
 *
 * The images name needs to be named like following: '{setting-id}-{choice-value}.png'
 * and need to be in the $IMG_ADMIN path.
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Radio_Image extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'kkcp_radio_image';

	/**
	 * Render template for choice displayment.
	 *
	 * It shows the full image path (`img_custom`) or an image bundled in the plugin
	 * when `img` has been passed, with the plugin url as prepath, and always a `png`
	 * extension.
	 * @since 0.0.1
	 */
	protected function js_tpl_choice_ui() {
		?>
			<input id="{{ id }}" class="kkcp-radio-image" type="radio" value="{{ val }}" name="_customize-kkcp_radio_image-{{ data.id }}"<?php // `checked` status synced through js in `control.ready()` ?>>
			<label class="{{helpClass}}" {{{ helpAttrs }}} for="{{ id }}">
				<# var imgUrl = choice.img_custom ? '<?php echo esc_url( KKcp_Theme::$images_base_url ); ?>' + choice.img_custom : '<?php echo esc_url( KKCP_PLUGIN_URL . 'assets/images/' ); ?>' + choice.img + '.png'; #>
				<img class="kkcpui-tooltip--top" src="{{ imgUrl }}" title="{{{label}}}">
			</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Radio_Image' );