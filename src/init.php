<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function yasothon_gutenberg_blocks_cgb_block_assets() { // phpcs:ignore
	// Styles.
	wp_enqueue_style(
		'yasothon_gutenberg_blocks-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);
}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'yasothon_gutenberg_blocks_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function yasothon_gutenberg_blocks_cgb_editor_assets() { // phpcs:ignore
	// Scripts.
	wp_enqueue_script(
		'yasothon_gutenberg_blocks-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: File modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'yasothon_gutenberg_blocks-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);
	
}

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'yasothon_gutenberg_blocks_cgb_editor_assets' );


/**
 * Add custom block category for Yasothon blocks.
 *
 */
if ( !function_exists( 'yasothon_block_category' ) ) :
    function yasothon_block_category( $categories, $post ) {
        return array_merge( $categories, array( array(
            'slug'  => 'yasothon_blocks',
			'title' => __( 'Yasothon Blocks', 'yasothon' ),
        ) ) );
    }
    
    add_filter(
        'block_categories',
        'yasothon_block_category',
        10,
        2
    );
endif;

/**
 * Create API fields for additional info
 */

if (! function_exists( 'yasothon_register_rest_fields' )) :
	function yasothon_register_rest_fields() {
		// Add landscape featured image source
		register_rest_field(
			'post',
			'featured_image_src',
			array(
				'get_callback' => 'yasothon_get_image_src_landscape',
				'update_callback' => null,
				'schema' => null,
			)
		);

		// Add square featured image source
		register_rest_field(
			'post',
			'featured_image_src_square',
			array(
				'get_callback' => 'yasothon_get_image_src_square',
				'update_callback' => null,
				'schema' => null,
			)
		);
		
		// Add author info
		register_rest_field(
			'post',
			'get_post_type',
			array(
				'get_callback' => 'yasothon_get_post_type',
				'update_callback' => null,
				'schema' => null,
			)
		);

		// Add author info
		register_rest_field(
			'post',
			'author_info',
			array(
				'get_callback' => 'yasothon_get_author_info',
				'update_callback' => null,
				'schema' => null,
			)
		);

		// Get categories from post id
		register_rest_field(
			'post',
			'categories_list',
			array(
				'get_callback' => 'yasothon_get_categories_list',
				'update_callback' => null,
				'schema' => array(
					'description' => __( 'Category list links' ),
					'type' => 'string',
				),
			)
		);

		// Get count comment from post id
		register_rest_field(
			'post',
			'count_comment',
			array(
				'get_callback' => 'yasothon_get_comment_count',
				'update_callback' => null,
				'schema' => array(
					'description' => __( 'Category count' ),
					'type' => 'string',
				),
			)
		);

		// Get avatar author from post id
		register_rest_field(
			'post',
			'avatar_author',
			array(
				'get_callback' => 'yasothon_get_avatar_author',
				'update_callback' => null,
				'schema' => array(
					'description' => __( 'Avatar Author' ),
					'type' => 'string',
				),
			)
		);
	}
endif;

add_action( 'rest_api_init', 'yasothon_register_rest_fields' );

/**
 * Get post type for displaying only post.
 */

if (! function_exists( 'yasothon_get_post_type' )) :
    function yasothon_get_post_type() {
         if ('post' === get_post_type() ) {
             return true;
         } else {
             return false;
         }
    }
endif;

/**
 * Get landscape featured image source for the rest field
 */

if (! function_exists( 'yasothon_get_image_src_landscape' )) :
	function yasothon_get_image_src_landscape( $object, $field_name, $request ) {
		$feat_img_array = wp_get_attachment_image_src(
			$object['featured_media'],
			'yasothon-image-featured',
			false
		);
		return $feat_img_array[0];
	}
endif;

/**
 * Get square featured image source for the rest field
 */

if (! function_exists( 'yasothon_get_image_src_square' )) :
	function yasothon_get_image_src_square( $object, $field_name, $request ) {
		$feat_img_array = wp_get_attachment_image_src(
			$object['featured_media'],
			'yasothon-image-square',
			false
		);
		return $feat_img_array[0];
	}
endif;

/**
 * Get author info for the rest field
 */

if (! function_exists( 'yasothon_get_author_info' )) :
	function yasothon_get_author_info( $object, $field_name, $request ) {
		// Get the author name
		$author_data['display_name'] = get_the_author_meta( 'display_name', $object['author'] );

		// Get the author link
		$author_data['author_link'] = get_author_posts_url( $object['author'] );

		// Return the author data
		return $author_data;
	}
endif;

if (! function_exists( 'yasothon_get_categories_list' )) :
	function yasothon_get_categories_list( $object, $field_name, $request ) {
		return yasothon_get_category_list($object['id']);
	}
endif;

/**
 * Get post categories with background color.
 **/

if ( ! function_exists( 'yasothon_get_category_list' ) ) :

	function yasothon_get_category_list ( $post_id = false ) {

		$category_list = '';

		$categories = apply_filters( 'the_category_list', get_the_category( $post_id ), $post_id );

		if ( empty( $categories ) ) {
			return;
		}

		foreach ( $categories as $category ) {

			$category_color = get_term_meta ( $category->term_id, '_yasothon_category_color', true );

			if(isset($category_color) && ($category_color !== '')) {
				$category_badge_style = 'background-color: '.$category_color.';';
			} else {
				$category_badge_style = 'background-color: black;';
			}

			$category_list .= '<div class="category-box" style="'.esc_attr($category_badge_style).'"><a href="' . esc_url( get_category_link( $category->term_id ) ) . '" >'. esc_html($category->name) .'</a></div>';
		}

		return $category_list;
	}

endif;

if (! function_exists( 'yasothon_get_comment_count' )) :
	function yasothon_get_comment_count( $object, $field_name, $request ) {
		return yasothon_blocks_comment_count($object['id']);
	}
endif;

if ( ! function_exists( 'yasothon_blocks_comment_count' ) ) :
	/**
	 * Prints HTML with the comment count for the current post.
	 */
	function yasothon_blocks_comment_count( $post_id ) {

			$discussion    = yasothon_get_discussion_post( $post_id );
			$has_responses = $discussion->responses > 0;

			if ( $has_responses ) {
				/* translators: %1(X comments)$s */
				$meta_label = sprintf( _n( '%d Comment', '%d Comments', $discussion->responses, 'yasothon' ), $discussion->responses );
			} else {
				$meta_label = __( 'No comments', 'yasothon' );
			}

			return $meta_label;
		
	}
endif;

if (! function_exists( 'yasothon_get_avatar_author' )) :
	function yasothon_get_avatar_author( $object, $field_name, $request ) {
		return get_avatar( get_the_author_meta( $object['id'] ) , 25 );
	}
endif;


if ( ! function_exists( 'yasothon_get_discussion_post' ) ) :
/**
 * Returns information about the current post's discussion, with cache support.
 */
function yasothon_get_discussion_post( $post_id = false ) {

	static $discussion;

	$current_post_id = $post_id;

	$comments = get_comments(
		array(
			'post_id' => $current_post_id,
			'orderby' => 'comment_date_gmt',
			'order'   => get_option( 'comment_order', 'asc' ), /* Respect comment order from Settings » Discussion. */
			'status'  => 'approve',
			'number'  => 20, /* Only retrieve the last 20 comments, as the end goal is just 6 unique authors */
		)
	);

	$authors = array();
	foreach ( $comments as $comment ) {
		$authors[] = ( (int) $comment->user_id > 0 ) ? (int) $comment->user_id : $comment->comment_author_email;
	}

	$authors    = array_unique( $authors );
	$discussion = (object) array(
		'authors'   => array_slice( $authors, 0, 6 ),           /* Six unique authors commenting on the post. */
		'responses' => get_comments_number( $current_post_id ), /* Number of responses. */
	);

	return $discussion;
}

endif;

/**
 *  Display categories list on sidebar for Gutenberg block
 */
if(!function_exists('yasothon_get_categories_count')):

	function yasothon_get_categories_count( $atts ) {
		
		$a = shortcode_atts( array(
			'title' => 'categories_list_count',
		), $atts );

		$categories_list = '';

		$categories_list .= '<div class="sidebar-header"><div class="sidebar-title"><h2>' . esc_attr($a['title']) . '</h2></div></div>';

		$categories_list .= '<div class="yasothon widget-category">';
		$categories_list .= '<ul>';
		$categories = get_categories();
		foreach($categories as $category) {
			$categories_list .= '<li><a href="' . get_category_link($category->term_id) . '">' . $category->name . '</a> <span class="category-count">'. $category->count .'</span></li>';
		}

		$categories_list .= '</ul>';
		$categories_list .= '</div>';

		return $categories_list;
	}
endif;

add_shortcode( 'categories_list_count', 'yasothon_get_categories_count' );

/**
 * Widget Socials icon
 */
if (! function_exists( 'yasothon_shortcode_socials_icon' ) ) :

	function yasothon_shortcode_socials_icon( $atts ) {

		$a = shortcode_atts( array(
			'title' => 'widget_socials',
		), $atts );

		$social_services_list = yasothon_social_services_list();

		$social_services_html = '';
		$social_icons = get_theme_mod('social_icons', array());

		foreach( $social_icons as $social_icon ) {

			$social_type = $social_icon['social_type'];
			$social_url = $social_icon['social_url'];

			$social_services_html .= '<div class="widget-social"><a href="'.esc_url( $social_url ).'" target="_blank"><div class="icon"><i class="fab fa-'.esc_attr( $social_type ).'"></i></div></a></div>';
		}

		if( $social_services_html !== '') {

			$social_widget = '<div class="widget widget-socials">';
			$social_widget .= '<div class="sidebar-header"><div class="sidebar-title"><h2>' . esc_attr($a['title']) . '</h2></div></div>';
			$social_widget .= '<div class="widget-socials-icon">';
			$social_widget .= $social_services_html;
			$social_widget .= '</div></div>';

			return wp_kses_post($social_widget);
		}
	}
endif;

add_shortcode( 'widget_socials', 'yasothon_shortcode_socials_icon' );