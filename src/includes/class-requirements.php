<?php defined( 'ABSPATH' ) or die;

/**
 * Short description for class
 *
 * Credits to Vladimir Anokhin and his `requirements.php` class in
 * the plugin Shortcodes Ultimate.
 *
 * @package    Customize_Plus
 * @subpackage Core
 * @author     PlusWP <dev@pluswp.com> (httpS://pluswp.com)
 * @copyright  2015 PlusWP (kunderi kuus)
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       httpS://pluswp.com/customize-plus
 */
class PWPcp_Requirements {

	/**
	 * Minimum php version supported
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public static $min_php_version = '5.2.4';

	/**
	 * Minimum WordPress version supported
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public static $min_wp_version = '4.1.1';

	/**
	 * List of incompatible plugins
	 *
	 * @since 0.0.1
	 * @var array
	 */
	public static $incompatible_plugins = array(
		array(
			'title' => 'Kirki Framework',
			'file' => 'kirki/kirki.php',
		),
	);

	/**
	 * Constructor
	 *
	 * @since 0.0.1
	 */
	public function __construct() {
		add_action( 'PWPcp/activation', array( __CLASS__, 'check_php_version' ) );
		add_action( 'PWPcp/activation', array( __CLASS__, 'check_wp_version' ) );
		if ( is_admin() ) {
			add_action( 'admin_init', array( __CLASS__, 'check_plugins_incompatibilities' ) );
			// @@todo the plugins get activated by themes anyway during live previews,
			// so for instance Maera framework install Kirki and mess up the customize \\
		}
	}

	/**
	 * Check PHP version
	 *
	 * @since 0.0.1
	 */
	public static function check_php_version() {
		$php_version = phpversion();
		load_plugin_textdomain( 'pkgTextDomain', false, dirname( plugin_basename( PWPCP_PLUGIN_FILE ) ), '/languages/' );
		$msg = sprintf( __( '<h1>Oops! Plugin not activated&hellip;</h1><p>%s is not fully compatible with your PHP version (%s).<br />Reccomended PHP version &ndash; %s (or higher).</p><a href="%s">&larr; Return to the plugins screen</a>' ), '<b>Customize Plus</b>', $php_version, self::$min_php_version, network_admin_url( 'plugins.php?deactivate=true' ), $_SERVER['REQUEST_URI'] . '&continue=true', ' style="float:right;font-weight:bold"' );

		// PHP version is too low
		if ( version_compare( self::$min_php_version, $php_version, '>' ) ) {
			deactivate_plugins( plugin_basename( PWPCP_PLUGIN_FILE ) );
			wp_die( $msg );
		}
	}

	/**
	 * Check WordPress version
	 *
	 * @since 0.0.1
	 */
	public static function check_wp_version() {
		$wp_version = get_bloginfo( 'version' );
		load_plugin_textdomain( 'pkgTextDomain', false, dirname( plugin_basename( PWPCP_PLUGIN_FILE ) ), '/languages/' );
		$msg = sprintf( __( '<h1>Oops! Plugin not activated&hellip;</h1><p>%s is not fully compatible with your version of WordPress (%s).<br />Reccomended WordPress version &ndash; %s (or higher).</p><a href="%s">&larr; Return to the plugins screen</a> <a href="%s"%s>Continue and activate anyway &rarr;</a>' ), '<b>Customize Plus</b>', $wp_version, self::$min_wp_version, network_admin_url( 'plugins.php?deactivate=true' ), $_SERVER['REQUEST_URI'] . '&continue=true', ' style="float:right;font-weight:bold"' );
		// Check Forced activation
		if ( isset( $_GET['continue'] ) ) {
			return;
		}
		// PHP version is too low
		elseif ( version_compare( self::$min_wp_version, $wp_version, '>' ) ) {
			deactivate_plugins( plugin_basename( PWPCP_PLUGIN_FILE ) );
			wp_die( $msg );
		}
	}

	/**
	 * Check plugin incompatibilities
	 *
	 * @since 0.0.1
	 */
	public static function check_plugins_incompatibilities() {
		$deactivated_plugins = array();

		// deactivate incompatible plugins and show a notice
		foreach ( self::$incompatible_plugins as $plugin ) {
			if ( self::deactivate_plugin( $plugin['file'], $plugin['title'] ) ) {
				array_push( $deactivated_plugins, $plugin['title'] );
			}
		}

		if ( ! empty( $deactivated_plugins ) ) {

			// let's not mess to much here and use php closures (> 5.3.0 required)
			if ( version_compare( PHP_VERSION, '5.3.0' ) >= 0 ) {

				add_action( 'admin_notices', function() use ( $deactivated_plugins ) {

					// inspired by TGM-Plugin-Activation by Thomas Griffin and Gary Jones
					$self_title = '<a href="' . admin_url( 'plugins.php' ) . '#customize-plus"><b>Customize Plus</b></a>';
					$count = count( $deactivated_plugins );
					$last_plugin = array_pop( $deactivated_plugins ); // Pop off last name to prep for readability.
					$imploded    = empty( $deactivated_plugins ) ? '<b>' . $last_plugin . '</b>' : '<b>' . ( implode( ', ', $deactivated_plugins ) . '</b> and <b>' . $last_plugin . '</b>.' );
					echo sprintf( '<div id="message" class="updated" style="border-color: #ffba00;"><p>%1$s<br><em>%2$s</em></p></div>', _n( sprintf( __( 'The plugin %1$s has been deactivated because is not compatible with %2$s.' ), $imploded, $self_title ), sprintf( __( 'The plugins %1$s has been deactivated because they are not compatible with %2$s.' ), $imploded, $self_title ), $count, 'pkgTextDomain' ), _n( sprintf( __( 'If you need to use it deactivate %s first.' ), $self_title ), sprintf( __( 'If you need to use them deactivate %s first.' ), $self_title ), $count, 'pkgTextDomain' ) );
				}, 90 );
			}
		}
	}

	/**
	 * Deactivate plugin
	 *
	 * @since 0.0.1
	 * @param  string  $probable_file  Probable file name of the plugin to search.
	 * @param  string  $probable_title Probable title of the plugin to search for.
	 * @param  boolean $deep_search    Whether to execute a deep search through
	 *                                 all the active plugins based on the plugin
	 *                                 title.
	 * @return int Either `1` (success) or `0` (failure)
	 */
	public static function deactivate_plugin( $probable_file, $probable_title, $deep_search = false ) {
		if ( is_plugin_active( $probable_file ) ) {
			deactivate_plugins( $probable_file );
			return 1;
		} else if ( $deep_search ) {
			// If the plugin is not in the usual place, try looking through all active plugins.
			$active_plugins = (array) get_option( 'active_plugins', array() );
			foreach ( $active_plugins as $plugin ) {
				$data = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin );
				if ( $data['Name'] == $probable_title ) {
					deactivate_plugins( $plugin );
					return 1;
				}
			}
		}
		return 0;
	}
}

// Instantiate
new PWPcp_Requirements;
