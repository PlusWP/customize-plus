<?php defined( 'ABSPATH' ) or die;

/**
 * Plugin Name: Customize Plus
 * Plugin URI: https://knitkode.com/products/customize-plus
 * Description: Enhance and extend the WordPress Customize in your themes.
 * Version: 1.1.1
 * Author: KnitKode
 * Author URI: https://knitkode.com/
 * License: GPLv3+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: kkcp
 * Domain Path: /languages
 *
 * Copyright (C) 2014-2018 KnitKode (https://knitkode.com/)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package Customize_Plus
 */

define( 'KKCP_PLUGIN_FILE', __FILE__ );
define( 'KKCP_PLUGIN_VERSION', '1.1.1' );
define( 'KKCP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'KKCP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once( KKCP_PLUGIN_DIR . 'php/class-requirements.php' );
require_once( KKCP_PLUGIN_DIR . 'php/class-data.php' );
require_once( KKCP_PLUGIN_DIR . 'php/class-helper.php' );
require_once( KKCP_PLUGIN_DIR . 'php/class-singleton.php' );
require_once( KKCP_PLUGIN_DIR . 'php/class-core.php' );
require_once( KKCP_PLUGIN_DIR . 'php/class-sanitizejs.php' );
require_once( KKCP_PLUGIN_DIR . 'php/class-customize.php' );
require_once( KKCP_PLUGIN_DIR . 'php/class-theme.php' );
if ( is_admin() ) {
	require_once( KKCP_PLUGIN_DIR . 'php/class-validate.php' );
	require_once( KKCP_PLUGIN_DIR . 'php/class-sanitize.php' );
	require_once( KKCP_PLUGIN_DIR . 'php/class-admin.php' );
	require_once( KKCP_PLUGIN_DIR . 'php/class-admin-about.php' );
}

do_action( 'kkcp_after_requires' );