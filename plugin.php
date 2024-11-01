<?php
/**
 * Plugin Name: Yasothon
 * Plugin URI: https://malaratn.com/yasothon-plugin/
 * Description: Yasothon is a cool plugin for the page editor that have many several blocks to custom your homepage. It is easy to use you just add block and select post categories on the right panel, it will display the style following block.
 * Author: Wittaya Malaratn
 * Author URI: https://malaratn.com/yasothon-theme/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Yasothon Gutenberg Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once( plugin_dir_path( __FILE__ ) . 'src/init.php' );

/**
 * Yasothon Blocks
 */

require_once( plugin_dir_path( __FILE__ ) . 'src/blocks/posts/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/blocks/posts-list-sidebar/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/blocks/featured-posts/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/blocks/posts-text-inner/index.php' );

require_once( plugin_dir_path( __FILE__ ) . 'src/blocks/post-style-1/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/blocks/post-style-2/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/blocks/post-style-3/index.php' );
require_once( plugin_dir_path( __FILE__ ) . 'src/blocks/post-style-4/index.php' );