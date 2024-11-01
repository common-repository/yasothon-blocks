<?php

/**
 * Renders the post grid block on server.
 */
function yasothon_render_block_posts( $attributes ) {

	$categories = isset( $attributes['categories'] ) ? $attributes['categories'] : '';

	$recent_posts = wp_get_recent_posts( array(
		'numberposts' => $attributes['postsToShow'],
		'post_status' => 'publish',
		'order' => $attributes['order'],
		'orderby' => $attributes['orderBy'],
		'category' => $categories,
	), 'OBJECT' );

	$list_items_markup = '';

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
					'<header class="entry-header height-%1$s">
						<a href="%2$s" rel="bookmark">
							<figure class="post-thumbnail height-%3$s" style="width: 100%%; background-image: url(%4$s);">',
					esc_attr((int)$attributes['imageHeight']),
					esc_url( get_permalink( $post_id ) ),
					esc_attr((int)$attributes['imageHeight']),
					esc_attr($image[0])
					
				);

				if ( isset( $attributes['displayCategoryList'] ) && $attributes['displayCategoryList'] ) {

					$list_items_markup .= sprintf(
						'<div class="category-list w-clearfix">%1$s</div>',
						yasothon_get_category_list($post_id)
					);
				}

				$list_items_markup .= '</figure></a></header>';

			}

			// Wrap the text content
			$list_items_markup .= sprintf(
				'<div class="entry-content">'
			);

			
			// Get the post title
				$title = get_the_title( $post_id );

			if ( ! $title ) {
				$title = __( 'Untitled', 'yasothon' );
			}

			$list_items_markup .= sprintf(
				'<h2 class="entry-title font-size-%1$s"><a href="%2$s" rel="bookmark">%3$s</a></h2>',
				esc_attr($attributes['titleFontSize']),
				esc_url( get_permalink( $post_id ) ),
				esc_html( $title )
			);

				// Wrap the byline content
				$list_items_markup .= sprintf(
					'<div class="entry-meta">'
				);

				if ( $attributes['columns'] != 4 ) {
					$list_items_markup .= sprintf(
						'<span class="avatar">%1$s</span>',
						get_avatar( get_the_author_meta( 'ID' ) , 25 )
					);
				}

					$meta .= 'has-byline';
					$list_items_markup .= sprintf(
						'<span class="byline"> 
							<span class="author vcard">
								<a class="url fn n" href="%1$s">%2$s</a>
							</span>
						</span>',
						esc_url( get_author_posts_url( $post->post_author ) ),
						esc_html( get_the_author_meta( 'display_name', $post->post_author ) )
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

					if ( $attributes['columns'] < 3 && $attributes['columns'] != 1 ) {

						$list_items_markup .= sprintf(
							'<span class="comment-count"><span class="comments-link">%1$s</span></span>',
							yasothon_blocks_comment_count( $post_id )
						);

					}
					
				// Close the byline content
				$list_items_markup .= sprintf(
					'</div>'
				);

				if ( $attributes['displayPostExcerpt'] ) {

					// Wrap the excerpt content
					$list_items_markup .= sprintf(
						'<div class="posts-excerpt font-size-%1$s">',
						esc_attr($attributes['bodyFontSize'])
					);

					// Get the excerpt
					$excerpt = apply_filters( 'the_excerpt', get_post_field( 'post_excerpt', $post_id, 'display' ) );

					if( empty( $excerpt ) ) {
						$excerpt = apply_filters( 'the_excerpt', wp_trim_words( $post->post_content, 35 ) );
					}

					if ( ! $excerpt ) {
						$excerpt = null;
					}

					if ( isset( $attributes['displayPostExcerpt'] ) && $attributes['displayPostExcerpt'] ) {
						$list_items_markup .=  wp_kses_post( $excerpt );
					}

					// Close the excerpt content
					$list_items_markup .= sprintf(
						'</div>'
					);

				}

			// Wrap the text content
			$list_items_markup .= sprintf(
				'</div>'
			);

			// Close the markup for the post
			$list_items_markup .= "</article>\n";
		}
	}

	// Build the classes
	$class = "yasothon-gutenberg-posts posts-block";

	if ( isset( $attributes['className'] ) ) {
		$class .= ' ' . $attributes['className'];
	}

	$grid_class .= 'is-grid columns-' . $attributes['columns'];

	// if ( isset( $attributes['columns'] ) && 'grid' === $attributes['postLayout'] ) {
	// 	$grid_class .= ' columns-' . $attributes['columns'];
	// }

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
 * Registers the `yasothon/yasothon-posts` block on server.
 */

if ( ! function_exists( 'yasothon_register_block_posts' ) ) :
	
	function yasothon_register_block_posts() {

		// Check if the register function exists
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type( 'yasothon/yasothon-posts', array(
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
				'displayCategoryList' => array(
					'type' => 'boolean',
					'default' => true,
				),
				'displayPostExcerpt' => array(
					'type' => 'boolean',
					'default' => true,
				),
				'titleFontSize' => array(
					'type' => 'string',
					'default' => '30',
				),
				'bodyFontSize' => array(
					'type' => 'string',
					'default' => '14',
				),
				'columns' => array(
					'type' => 'number',
					'default' => 2,
				),
				'imageHeight' => array(
					'type' => 'string',
					'default' => '250',
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
			),
			'render_callback' => 'yasothon_render_block_posts',
		) );
	}
endif;

add_action( 'init', 'yasothon_register_block_posts' );