

import isUndefined from 'lodash/isUndefined';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import classnames from 'classnames';

const { Component, Fragment } = wp.element;

const { __ } = wp.i18n;

const { decodeEntities } = wp.htmlEntities;

const {
	withSelect,
} = wp.data;

const {
	PanelBody,
	Placeholder,
	QueryControls,
	RangeControl,
	SelectControl,
	Spinner,
	TextControl,
	ToggleControl,
} = wp.components;

const {
	InspectorControls,
	BlockAlignmentToolbar,
	BlockControls,
} = wp.editor;

class PostsBlock extends Component {

	render() {
		const { attributes, categoriesList, setAttributes, latestPosts } = this.props;
        const { postStyle, displayCategoryList, displayExcerpt, align, order, orderBy, categories } = attributes;

        // Post layout options
        const featuredPostsStyle = [
			{ value: 'style1', label: __( 'Style 1' ) },
            { value: 'style2', label: __( 'Style 2' ) },
            { value: 'style3', label: __( 'Style 3' ) },
            { value: 'style4', label: __( 'Style 4' ) },
            { value: 'style5', label: __( 'Style 5' ) },
        ];

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
                    <SelectControl
							label={ __( 'Featured Posts Style' ) }
							options={ featuredPostsStyle }
							value={ postStyle }
							onChange={ postStyle => setAttributes( { postStyle } ) }
					/>
					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ 1 }
						categoriesList={ categoriesList }
						selectedCategoryId={ categories }
						onOrderChange={ ( value ) => setAttributes( { order: value } ) }
						onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
						onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
					/>
                    <ToggleControl
						label={ __( 'Display Category List' ) }
						checked={ displayCategoryList }
						onChange={ displayCategoryList => setAttributes( { displayCategoryList } ) }
					/>
                    { postStyle != 'style3' && postStyle != 'style4' &&
                    <ToggleControl
						label={ __( 'Display Content Excerpt' ) }
						checked={ displayExcerpt }
						onChange={ displayExcerpt => setAttributes( { displayExcerpt } ) }
					/>
                    }
                </PanelBody>
			</InspectorControls>
		);

		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ inspectorControls }
					<Placeholder
						icon="admin-post"
						label={ __( 'Yasothon Blocks Posts' ) }
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found.' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		// Removing posts from display should be instant.
		const displayPosts = (postStyle == 'style3' || postStyle == 'style4' ) ? //latestPosts.length > postsToShow
			latestPosts.slice( 0, 3 ) :
            latestPosts.slice( 0, 1 );

		return (
			<Fragment>
				{ inspectorControls }
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ align => setAttributes( { align } ) }
                        controls={ [ 'center', 'wide', 'full' ] }
                        
					/>
				</BlockControls>
				<div
					className={ classnames(
						this.props.className,
						'yasothon-gutenberg-posts',
					) }
				>
    
                    { postStyle == 'style1' &&

                    
                        
                        displayPosts.map( ( post, i ) => {
                            return (
                                <div class="header-featured-image style-1" style={{backgroundImage: `url(${ post.featured_image_src })`}}>
                                    <div class="featured-post">
                                        <article class="post">
                                        { displayCategoryList && 
                                            <div class="category-list w-clearfix" dangerouslySetInnerHTML={ { __html: post.categories_list } } />
                                        }
                                        <h2 className={ `entry-title` }><a href={ post.link } target="_blank" rel="bookmark">{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }</a></h2>
                                            { post.get_post_type && 
                                                <div class="entry-meta">

                                                    { post.avatar_author && 
                                                        <span dangerouslySetInnerHTML={ { __html: post.avatar_author } } />
                                                    }
                                                
                                                    { post.author_info.display_name &&
                                                        <span class="byline"><span class="author vcard"><a class="url fn n" href={ post.author_info.author_link } target="_blank">{ post.author_info.display_name }</a></span></span>
                                                    }

                                                    { post.date_gmt &&
                                                        <span class="posted-on">
                                                            <a href={ post.link } rel="bookmark" target="_blank">
                                                                <time class="entry-date published" dateTime={ moment( post.date_gmt ).utc().format() }>{ moment( post.date_gmt ).local().format( 'MMMM DD, Y' ) }</time>
                                                            </a>
                                                        </span>
                                                    }

                                                    { post.count_comment &&
                                                        <span class="comment-count"><span class="comments-link">{ post.count_comment }</span></span>
                                                    }

                                                </div>
                                            }
                                            { displayExcerpt && 
                                                <div class="entry-content">
                                                <div class="posts-excerpt" dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } } />
                                                </div>
                                            }
                                        </article>
                                    </div>
                                </div>

                            )
                        })
                        
                    }

                    { postStyle == 'style2' &&
                        
                        displayPosts.map( ( post, i ) => {
                            return (
                                <div class="header-featured-image style-2" style={{backgroundImage: `url(${ post.featured_image_src })`}}>
                                <div class="featured-post">
                                    <div class="entry-box-center">
                                        <article class="post">
                                            { displayCategoryList && 
                                                <div class="category-list w-clearfix" dangerouslySetInnerHTML={ { __html: post.categories_list } } />
                                            }
                                            <h2 className={ `entry-title` }><a href={ post.link } target="_blank" rel="bookmark">{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }</a></h2>
                                            { post.get_post_type && 
                                                <div class="entry-meta">

                                                    { post.avatar_author && 
                                                        <span dangerouslySetInnerHTML={ { __html: post.avatar_author } } />
                                                    }
                                                
                                                    { post.author_info.display_name &&
                                                        <span class="byline"><span class="author vcard"><a class="url fn n" href={ post.author_info.author_link } target="_blank">{ post.author_info.display_name }</a></span></span>
                                                    }

                                                    { post.date_gmt &&
                                                        <span class="posted-on">
                                                            <a href={ post.link } rel="bookmark" target="_blank">
                                                                <time class="entry-date published" dateTime={ moment( post.date_gmt ).utc().format() }>{ moment( post.date_gmt ).local().format( 'MMMM DD, Y' ) }</time>
                                                            </a>
                                                        </span>
                                                    }

                                                    { post.count_comment &&
                                                        <span class="comment-count"><span class="comments-link">{ post.count_comment }</span></span>
                                                    }

                                                </div>
                                            }
                                            { displayExcerpt && 
                                                <div class="entry-content">
                                                <div class="posts-excerpt" dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } } />
                                                </div>
                                            }
                                        </article>
                                    </div>
                                </div>
                            </div>


                            )
                        })
                        
                    }
                    
                    { postStyle == 'style3' &&
                        
                        <div class="header-featured-image style-3">
                                    <div class="entry-box grid columns-2">

                        { displayPosts.map( ( post, i ) => {
                            return (
                                
                                <article class="post-id" style={{backgroundImage: `url(${ post.featured_image_src })`}}>
                                    <div class="post">
                                    { displayCategoryList && 
                                        <div class="category-list w-clearfix" dangerouslySetInnerHTML={ { __html: post.categories_list } } />
                                    }
                                    <h2 className={ `entry-title` }><a href={ post.link } target="_blank" rel="bookmark">{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }</a></h2>
                                        { post.get_post_type && 
                                                <div class="entry-meta">

                                                    { post.avatar_author && 
                                                        <span dangerouslySetInnerHTML={ { __html: post.avatar_author } } />
                                                    }
                                                
                                                    { post.author_info.display_name &&
                                                        <span class="byline"><span class="author vcard"><a class="url fn n" href={ post.author_info.author_link } target="_blank">{ post.author_info.display_name }</a></span></span>
                                                    }

                                                    { post.date_gmt &&
                                                        <span class="posted-on">
                                                            <a href={ post.link } rel="bookmark" target="_blank">
                                                                <time class="entry-date published" dateTime={ moment( post.date_gmt ).utc().format() }>{ moment( post.date_gmt ).local().format( 'MMMM DD, Y' ) }</time>
                                                            </a>
                                                        </span>
                                                    }

                                                    { post.count_comment &&
                                                        <span class="comment-count"><span class="comments-link">{ post.count_comment }</span></span>
                                                    }

                                                </div>
                                            }
                                    </div>
                                </article>
                            )
                        })
                    }
                        </div>
                        </div>
                        
                    }

                    { postStyle == 'style4' &&
                        
                        <div class="header-featured-image style-4">
                                    <div class="entry-box grid columns-3">

                        { displayPosts.map( ( post, i ) => {
                            return (
                                
                                <article class="post-id" style={{backgroundImage: `url(${ post.featured_image_src })`}}>
                                    <div class="post">
                                        { displayCategoryList && 
                                            <div class="category-list w-clearfix" dangerouslySetInnerHTML={ { __html: post.categories_list } } />
                                        }
                                        <h2 className={ `entry-title` }><a href={ post.link } target="_blank" rel="bookmark">{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }</a></h2>
                                            { post.get_post_type && 
                                                <div class="entry-meta">

                                                    { post.avatar_author && 
                                                        <span dangerouslySetInnerHTML={ { __html: post.avatar_author } } />
                                                    }
                                                
                                                    { post.author_info.display_name &&
                                                        <span class="byline"><span class="author vcard"><a class="url fn n" href={ post.author_info.author_link } target="_blank">{ post.author_info.display_name }</a></span></span>
                                                    }

                                                    { post.date_gmt &&
                                                        <span class="posted-on">
                                                            <a href={ post.link } rel="bookmark" target="_blank">
                                                                <time class="entry-date published" dateTime={ moment( post.date_gmt ).utc().format() }>{ moment( post.date_gmt ).local().format( 'MMMM DD, Y' ) }</time>
                                                            </a>
                                                        </span>
                                                    }

                                                    { post.count_comment && i == 1 &&
                                                        <span class="comment-count"><span class="comments-link">{ post.count_comment }</span></span>
                                                    }

                                                </div>
                                            }
                                    </div>
                                </article>
                            )
                        })
                    }
                        </div>
                        </div>
                        
                    }

                    { postStyle == 'style5' &&
                        
                        displayPosts.map( ( post, i ) => {
                            return (
                                <div class="header-featured-image style-5">
                                <div class="entry-box" style={{backgroundImage: `url(${ post.featured_image_src })`}}>
                                    <article class="post-id">
                                        <div class="post">
                                        { displayCategoryList && 
                                            <div class="category-list w-clearfix" dangerouslySetInnerHTML={ { __html: post.categories_list } } />
                                        }
                                        <h2 className={ `entry-title` }><a href={ post.link } target="_blank" rel="bookmark">{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }</a></h2>
                                            { post.get_post_type && 
                                                <div class="entry-meta">

                                                    { post.avatar_author && 
                                                        <span dangerouslySetInnerHTML={ { __html: post.avatar_author } } />
                                                    }
                                                
                                                    { post.author_info.display_name &&
                                                        <span class="byline"><span class="author vcard"><a class="url fn n" href={ post.author_info.author_link } target="_blank">{ post.author_info.display_name }</a></span></span>
                                                    }

                                                    { post.date_gmt &&
                                                        <span class="posted-on">
                                                            <a href={ post.link } rel="bookmark" target="_blank">
                                                                <time class="entry-date published" dateTime={ moment( post.date_gmt ).utc().format() }>{ moment( post.date_gmt ).local().format( 'MMMM DD, Y' ) }</time>
                                                            </a>
                                                        </span>
                                                    }

                                                    { post.count_comment &&
                                                        <span class="comment-count"><span class="comments-link">{ post.count_comment }</span></span>
                                                    }

                                                </div>
                                            }
                                            { displayExcerpt && 
                                                <div class="entry-content">
                                                    <div class="posts-excerpt" dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } } />
                                                </div>
                                            }
                                        </div>
                                    </article>
                                </div>
                            </div>
                            )
                        })
                    }
             
				</div>
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy, categories } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const latestPostsQuery = pickBy( {
		categories,
		order,
		orderby: orderBy,
		per_page: 3,
	}, ( value ) => ! isUndefined( value ) );
	const categoriesListQuery = {
        per_page: 100,
	};
	return {
		latestPosts: getEntityRecords( 'postType', 'post', latestPostsQuery ),
		categoriesList: getEntityRecords( 'taxonomy', 'category', categoriesListQuery ),
	};
} )( PostsBlock );