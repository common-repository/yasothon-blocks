<?php

/**
 * Renders the home block on server.
 */
function yasothon_render_block_posts_sidebar( $attributes ) {

	$categories = isset( $attributes['categories'] ) ? $attributes['categories'] : '';

	$recent_posts = wp_get_recent_posts( array(
		'numberposts' => $attributes['postsToShow'],
		'post_status' => 'publish',
		'order' => $attributes['order'],
		'orderby' => $attributes['orderBy'],
		'category' => $categories,
	), 'OBJECT' );

	$list_items_markup = '';

	$list_items_markup .= sprintf(
		'<div class="post-title-sidebar">%1$s</div>',
		esc_attr( $attributes['postTitle'] )
	);

	if ( $recent_posts ) {
		foreach ( $recent_posts as $post ) {
			// Get the post ID
			$post_id = $post->ID;

			// Get the post thumbnail
			$post_thumb_id = get_post_thumbnail_id( $post_id );

			if ( $post_thumb_id ) {
				$post_thumb_class = 'has-thumbnail';
			} else {
				$post_thumb_class = 'no-thumbnail';
			}

			// Start the markup for the post
			$list_items_markup .= sprintf(
				'<article class="%1$s">',
				esc_attr( $post_thumb_class )
			);

			// Get the featured image
			if ( $post_thumb_id ) {

				$image = wp_get_attachment_image_src( $post_thumb_id, 'yasothon-image-landscape' );

				$list_items_markup .= sprintf(
					'<header class="entry-header">
						<figure class="post-thumbnail">
							<a href="%1$s" rel="bookmark">
								<div class="post-thumbnail-image" style="background-image: url(%2$s);"></div>
							</a>
					',
					esc_url( get_permalink( $post_id ) ),
					esc_attr($image[0])
					
				);

				$list_items_markup .= '</figure></header>';

			}

			// Wrap the text content
			$list_items_markup .= sprintf(
				'<div class="entry-content">'
			);

				$list_items_markup .= sprintf(
					'<h2 class="entry-title"><a href="%1$s" rel="bookmark">%2$s</a></h2>',
					esc_url( get_permalink( $post_id ) ),
					esc_html( get_the_title( $post_id ) )
				);

				$meta = '';

				// Wrap the byline content
				$list_items_markup .= sprintf(
					'<div class="entry-meta">'
				);
				
					$list_items_markup .= sprintf(
						'<span class="posted-on">
							<a href="%1$s" rel="bookmark">
								<time class="entry-date published" datetime="%2$s">%3$s</time>
							</a>
						</span>',
						esc_url( get_permalink( $post_id ) ),
						esc_attr( get_the_date( 'c', $post_id ) ),
						esc_html( get_the_date( '', $post_id ) )
					);
					
				// Close the byline content
				$list_items_markup .= sprintf(
					'</div>'
				);

			// Wrap the text content
			$list_items_markup .= sprintf(
				'</div>'
			);

			// Close the markup for the post
			$list_items_markup .= "</article>\n";
		}
	}

	// Build the classes
	$class = "yasothon-gutenberg-posts";

	$grid_class = 'posts-list';

	// Output the post markup
	$block_content = sprintf(
		'<div class="%1$s"><div class="%2$s">%3$s</div></div>',
		esc_attr( $class ),
		esc_attr( $grid_class ),
		$list_items_markup
	);

	return $block_content;
}

/**
 * Registers the `yasothon/yasothon-posts-sidebar` block on server.
 */

if ( ! function_exists( 'yasothon_register_block_posts_sidebar' ) ) :
	
	function yasothon_register_block_posts_sidebar() {

		// Check if the register function exists
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type( 'yasothon/yasothon-posts-list-sidebar', array(
			'attributes' => array(
				'categories' => array(
					'type' => 'string',
				),
				'className' => array(
					'type' => 'string',
				),
				'postsToShow' => array(
					'type' => 'number',
					'default' => 4,
				),
				'align' => array(
					'type' => 'string',
					'default' => 'center',
				),
				'width' => array(
					'type' => 'string',
					'default' => 'full',
				),
				'order' => array(
					'type' => 'string',
					'default' => 'desc',
				),
				'orderBy'  => array(
					'type' => 'string',
					'default' => 'date',
				),
				'postTitle'  => array(
					'type' => 'string',
					'default' => '',
				),
			),
			'render_callback' => 'yasothon_render_block_posts_sidebar',
		) );
	}
endif;

add_action( 'init', 'yasothon_register_block_posts_sidebar' );

