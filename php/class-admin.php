<?php defined( 'ABSPATH' ) or die;

if ( class_exists( 'KKcp_Singleton' ) ):

	/**
	 * Admin
	 *
	 * Manage the admin side Customize Plus.
	 *
	 * @package    Customize_Plus
	 * @subpackage Admin
	 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
	 * @copyright  2018 KnitKode
	 * @license    GPLv3
	 * @version    Release: 1.1.1
	 * @link       https://knitkode.com/products/customize-plus
	 */
	class KKcp_Admin extends KKcp_Singleton {

		/**
		 * The menu page
		 *
		 * @since  1.0.0
		 */
		const MENU_PAGE = 'options-general.php';

		/**
		 * Parent hook
		 *
		 * @since  1.0.0
		 */
		const PARENT_HOOK = 'customize-plus';

		/**
		 * The options subpages array
		 *
		 * @since  1.0.0
		 * @var array
		 */
		private $subpages = array();

		/**
		 * The options page default tab
		 *
		 * @since  1.0.0
		 * @var string
		 */
		private $default_tab = 'about';

		/**
		 * Constructor
		 *
		 * @since 1.0.0
		 */
		protected function __construct() {

			// Add menu item to settings menu
			add_action( 'admin_menu', array( $this, 'menu' ), 15 );

			// Remove subpages from side menu
			add_action( 'admin_head', array( $this, 'hide_subpages' ), 999 );

			// Enqueue all admin JS and CSS
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		}

		/**
		 * Public method to add subpages to Customize Plus
		 *
		 * @since  1.0.0
		 * @param  array $subpages An array of subpages array, each one needs a `title`
		 *                         and a `view` callable function.
		 */
		final public function add_subpages( $subpages ) {
			if ( is_array( $subpages ) ) {
				foreach ( $subpages as $id => $subpage ) {
					if ( is_array( $subpage ) ) {
						$this->subpages[ sanitize_key( $id ) ] = $subpage;
					}
				}
			}
		}

		/**
		 * Set default tab, the one visible when no query param is added to the url
		 *
		 * @since  1.0.0
		 * @param  string $subpage_id  The subpage / tab id to set as default.
		 */
		final public function set_default_tab( $subpage_id ) {
			$this->default_tab = sanitize_key( $subpage_id );
		}

		/**
		 * Add the navigational menu elements.
		 *
		 * @since  1.0.0
		 * @uses   add_submenu_page() To add the the page submenu
		 */
		public function menu() {

			// Bail if user cannot moderate
			if ( ! current_user_can( 'manage_options' ) ) {
				return;
			}

			add_submenu_page(
				self::MENU_PAGE,
				esc_html__( 'Customize Plus', 'kkcp' ),
				esc_html__( 'Customize Plus', 'kkcp' ),
				'manage_options',
				self::PARENT_HOOK,
				array( $this, 'get_view' )
			);

			$hooks = array();

			foreach ( $this->subpages as $subpage_id => $subpage_args ) {
				$hooks[] = add_submenu_page(
					self::MENU_PAGE,
					$subpage_args['title'],
					esc_html__( 'Customize Plus', 'kkcp' ),
					'manage_options',
					self::PARENT_HOOK . 'tab=' . sanitize_key( $subpage_id ),
					'__return_null'
				);
			}
		}

		/**
		 * Hide subpages from side menu removing them
		 *
		 * @since 1.0.0
		 */
		public function hide_subpages() {
			foreach ( $this->subpages as $subpage_id => $subpage_args ) {
				remove_submenu_page( self::MENU_PAGE, self::PARENT_HOOK . 'tab=' . $subpage_id );
			}
		}

		/**
		 * Add some general styling to the admin area.
		 *
		 * @since 1.0.0
		 * @param string $hook The page hook
		 */
		public function enqueue_scripts( $hook ) {
			if ( 'settings_page_' . self::PARENT_HOOK === $hook ) {
				wp_enqueue_style( 'kkcp-admin', KKcp::get_asset( 'admin', 'css', KKCP_PLUGIN_FILE ), array( 'dashicons' ), KKCP_PLUGIN_VERSION );
				// wp_style_add_data( 'kkcp-admin', 'rtl', true );
			}
		}

		/**
		 * The view that wrap each subpage tab.
		 *
		 * @since  1.0.0
		 */
		public function get_view() {
		?>
			<?php
			$allowed_tabs = array();
			foreach ( $this->subpages as $subpage_id => $subpage_args ) {
				array_push( $allowed_tabs, $subpage_id );
			}
			if ( isset( $_GET['tab'] ) && in_array( sanitize_key( $_GET['tab'] ), $allowed_tabs ) ) {
				$active_tab = sanitize_key( $_GET['tab'] );
			} else {
				$active_tab = $this->default_tab;
			} ?>
			<div id="kkcp-admin-<?php esc_attr_e( $active_tab, 'kkcp' ); ?>" class="wrap">
				<h2 class="nav-tab-wrapper">
				<?php foreach ( $this->subpages as $subpage_id => $subpage_args ) {
					$active_class = ( $subpage_id === $active_tab ) ? ' nav-tab-active' : ''; ?>
					<a href="<?php echo esc_url( add_query_arg( array( 'page' => self::PARENT_HOOK, 'tab' => $subpage_id ), admin_url( self::MENU_PAGE ) ) ); ?>" class="nav-tab<?php esc_attr_e( $active_class, 'kkcp' ); ?>"><?php esc_html_e( $subpage_args['title'], 'kkcp' ); ?></a>
				<?php } ?>
				</h2>
				<?php	foreach ( $this->subpages as $subpage_id => $subpage_args ) {
					if ( $subpage_id === $active_tab ) {
						if ( is_callable( $subpage_args['view'] ) ) {
							call_user_func( $subpage_args['view'] );
						}
					}
				} ?>
			</div>
		<?php
		}
	}

	// Instantiate
	KKcp_Admin::get_instance();

endif;
