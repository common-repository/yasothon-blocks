<?php

/**
 * Renders the posts block on server.
 */
function yasothon_render_block_featured_posts( $attributes ) {

	$categories = isset( $attributes['categories'] ) ? $attributes['categories'] : '';

    $post_style = $attributes['postStyle'];
    $postsToShow = 1;

    $displayCategoryList = $attributes['displayCategoryList'];
    $displayExcerpt = $attributes['displayExcerpt'];

    if (($post_style == 'style3') || ($post_style == 'style4')) {
        $postsToShow = 3;
    }

	$recent_posts = wp_get_recent_posts( array(
		'numberposts' => $postsToShow,
		'post_status' => 'publish',
		'order' => $attributes['order'],
		'orderby' => $attributes['orderBy'],
		'category' => $categories,
	), 'OBJECT' );

    $list_items_markup = '<div class="yasothon-gutenberg-posts">';
    
    if ( $post_style == 'style3') {
        $list_items_markup .= '<div class="header-featured-image style-3"><div class="entry-box grid columns-2">';
    } elseif ( $post_style == 'style4' ) {
        $list_items_markup .= '<div class="header-featured-image style-4"><div class="entry-box grid columns-3">';
    }

    $i = 0;

	if ( $recent_posts ) {
		foreach ( $recent_posts as $post ) {
			// Get the post ID
            $post_id = $post->ID;
            
            // if ( ($post_style == 'style1') || ($post_style == 'style2') ) {

                if ( $post_style == 'style1' ) {
                    $style = 'style-1';
                } elseif ($post_style == 'style2') {
                    $style = 'style-2';
                }

                // Get the post thumbnail
                $post_thumb_id = get_post_thumbnail_id( $post_id );
                $image = wp_get_attachment_image_src( $post_thumb_id, 'yasothon-image-featured' );

                if (($post_style == 'style1') || ($post_style == 'style2') ) {
                    $list_items_markup .= sprintf('<div class="header-featured-image %1$s" style="background-image: url(%2$s);">',
                        $style,
                        esc_attr($image[0])
                    );
                } elseif ( $post_style == 'style5' ) {
                    $list_items_markup .= sprintf('<div class="header-featured-image style-5"><div class="entry-box" style="background-image: url(%1$s);">',
                        esc_attr($image[0])
                    );
                }
                
                // Start the markup for the post

                if ( $post_style == 'style1' ) {
                    $list_items_markup .= '<div class="featured-post"><article class="post">';
                } elseif ( $post_style == 'style2' ) {
                    $list_items_markup .= '<div class="featured-post"><div class="entry-box-center"><article class="post">';
                } elseif ( $post_style == 'style3' || $post_style == 'style4' ) {
                    $list_items_markup .= sprintf('<article class="post-id" style="background-image: url(%1$s);"><div class="post">',
                        esc_attr($image[0])
                    );
                } elseif ( $post_style == 'style5' ) {
                    $list_items_markup .= '<article class="post-id"><div class="post">';
                }

                if ( $displayCategoryList ) {

                    $list_items_markup .= sprintf(
                        '<div class="category-list w-clearfix">%1$s</div>',
                        yasothon_get_category_list($post_id)
                    );

                }

                $list_items_markup .= sprintf(
                    '<h2 class="entry-title"><a href="%1$s" rel="bookmark">%2$s</a></h2>',
                    esc_url( get_permalink( $post_id ) ),
                    esc_html( get_the_title( $post_id ) )
                );

                $list_items_markup .= '<div class="entry-meta">';
                $list_items_markup .= sprintf('<span>%1$s</span>',
                    get_avatar( get_the_author_meta( 'ID' ) , 25 )
                );

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

                $display_comment = true;
                if ( $post_style == 'style4' && ( $i == 0 || $i == 2 )) {
                    $display_comment = false;
                }
                
                if ($display_comment == true) {
                    
                    $discussion = yasothon_get_discussion_post( $post_id );
                    $has_responses = $discussion->responses > 0;
    
                    if ( $has_responses ) {
                        /* translators: %1(X comments)$s */
                        $meta_label = sprintf( _n( '%d Comment', '%d Comments', $discussion->responses, 'yasothon' ), $discussion->responses );
                    } else {
                        $meta_label = __( 'No comments', 'yasothon' );
                    }
    
                    $list_items_markup .= sprintf('<span class="comment-count">
                        <span class="comments-link">%1$s</span>
                        </span>',
                        esc_html( $meta_label )
                    );
                }

                $i++;

                $list_items_markup .= '</div><!-- entry-meta -->';

                if ( $post_style != 'style3' && $post_style != 'style4' ) {

                    if ( $displayExcerpt ) {

                        // Get the excerpt
                        $excerpt = apply_filters( 'the_excerpt', get_post_field( 'post_excerpt', $post_id, 'display' ) );
                        
                        if( empty( $excerpt ) ) {
                            $excerpt = apply_filters( 'the_excerpt', wp_trim_words( $post->post_content, 35 ) );
                        }

                        if ( ! $excerpt ) {
                            $excerpt = null;
                        }
                        

                        $list_items_markup .= sprintf('<div class="entry-content">%1$s</div>',
                            wp_kses_post( $excerpt )
                        );

                    }

                }

                if ( $post_style == 'style1' ) {
                    $list_items_markup .= '</article></div></div>';
                } elseif ($post_style == 'style2') {
                    $list_items_markup .= '</article></div></div></div>';
                } elseif ( $post_style == 'style3' || $post_style == 'style4' || $post_style == 'style5' ) {
                    $list_items_markup .= '</div></article>';
                }

            // }
		}
    }
    
    if ( $post_style == 'style3' || $post_style == 'style4' || $post_style == 'style5' ) {
        $list_items_markup .= '</div></div></div>';
    }

	return $list_items_markup;
}

/**
 * Registers the `yasothon/yasothon-featured-posts` block on server.
 */

if ( ! function_exists( 'yasothon_register_block_featured_posts' ) ) :
	
	function yasothon_register_block_featured_posts() {

		// Check if the register function exists
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type( 'yasothon/yasothon-featured-posts', array(
			'attributes' => array(
				'categories' => array(
					'type' => 'string',
				),
				'className' => array(
					'type' => 'string',
                ),
                'displayCategoryList' => array(
					'type' => 'boolean',
					'default' => true,
                ),
                'displayExcerpt' => array(
					'type' => 'boolean',
					'default' => true,
				),
				'postStyle' => array(
					'type' => 'string',
					'default' => 'style1',
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
			'render_callback' => 'yasothon_render_block_featured_posts',
		) );
	}
endif;

add_action( 'init', 'yasothon_register_block_featured_posts' );

