

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

const MAX_POSTS_COLUMNS = 4;

class PostsBlock extends Component {

	render() {
		const { attributes, categoriesList, setAttributes, latestPosts } = this.props;
        const { displayPostExcerpt, displayCategoryList, titleFontSize, bodyFontSize, imageHeight,
            align, columns, order, orderBy, categories, postsToShow, readMoreText } = attributes;

        // Image size height
        const imageHeightOptions = [
            { value: '200', label: __( '200 pixels' ) },
            { value: '250', label: __( '250 pixels' ) },
            { value: '300', label: __( '300 pixels' ) },
            { value: '350', label: __( '350 pixels' ) },
			{ value: '400', label: __( '400 pixels' ) },
			{ value: '450', label: __( '450 pixels' ) },
			{ value: '500', label: __( '500 pixels' ) },
			{ value: '550', label: __( '550 pixels' ) },
			{ value: '600', label: __( '600 pixels' ) },
        ];
        
        // Title font size
		 const titleFontSizeOptions = [
			{ value: '20', label: __( '20' ) },
			{ value: '22', label: __( '22' ) },
			{ value: '24', label: __( '24' ) },
			{ value: '26', label: __( '26' ) },
			{ value: '28', label: __( '28' ) },
			{ value: '30', label: __( '30' ) },
			{ value: '32', label: __( '32' ) },
			{ value: '34', label: __( '34' ) },
			{ value: '36', label: __( '36' ) },
			{ value: '38', label: __( '38' ) },
			{ value: '40', label: __( '40' ) },
			{ value: '42', label: __( '42' ) },
			{ value: '44', label: __( '44' ) },
		];

		// Body font size
        const bodyFontSizeOptions = [
			{ value: '14', label: __( '14' ) },
			{ value: '16', label: __( '16' ) },
			{ value: '18', label: __( '18' ) },
			{ value: '20', label: __( '20' ) },
			{ value: '22', label: __( '22' ) },
        ];

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'General Settings' ) }>
					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ postsToShow }
						categoriesList={ categoriesList }
						selectedCategoryId={ categories }
						onOrderChange={ ( value ) => setAttributes( { order: value } ) }
						onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
						onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
					/>
					<RangeControl
						label={ __( 'Columns' ) }
						value={ columns }
						onChange={ ( value ) => setAttributes( { columns: value } ) }
						min={ 1 }
						max={ ! hasPosts ? MAX_POSTS_COLUMNS : Math.min( MAX_POSTS_COLUMNS, latestPosts.length ) }
					/>
                </PanelBody>
                <PanelBody title={ __( 'Post Settings' ) }>
					<SelectControl
						label={ __( 'Image Size Height' ) }
						options={ imageHeightOptions }
						value={ imageHeight }
						onChange={ imageHeight => setAttributes( { imageHeight } ) }
					/>
                    <ToggleControl
						label={ __( 'Display Category List' ) }
						checked={ displayCategoryList }
						onChange={ displayCategoryList => setAttributes( { displayCategoryList } ) }
					/>
					<SelectControl
						label={ __( 'Title Font Size' ) }
						options={ titleFontSizeOptions }
						value={ titleFontSize }
						onChange={ titleFontSize => setAttributes( { titleFontSize } ) }
					/>
					<ToggleControl
						label={ __( 'Display Post Excerpt' ) }
						checked={ displayPostExcerpt }
						onChange={ displayPostExcerpt => setAttributes( { displayPostExcerpt } ) }
					/>
					{ displayPostExcerpt &&
					<SelectControl
						label={ __( 'Body Font Size' ) }
						options={ bodyFontSizeOptions }
						value={ bodyFontSize }
						onChange={ bodyFontSize => setAttributes( { bodyFontSize } ) }
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
		const displayPosts = latestPosts.length > postsToShow ?
			latestPosts.slice( 0, postsToShow ) :
			latestPosts;

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
						'posts-block'
					) }
				>
    
					<div
						className={ classnames( [ 
							`is-grid columns-${ columns }`
						] ) }
					>
                        { displayPosts.map( ( post, i ) => 
                        
							<article
								key={ i }
								className={ classnames(
									post.featured_image_src ? 'has-thumbnail' : 'no-thumbnail'
								) }
							>
							    {
									post.featured_image_src !== undefined && post.featured_image_src ? (
                                        <header class="entry-header" style={{ height: parseInt(imageHeight, 10) }}>
                                            <a href={ post.link } target="_blank" rel="bookmark">
												<figure class="post-thumbnail" style={{ width: '100%', height: parseInt(imageHeight, 10), backgroundImage: `url(${ post.featured_image_src })` }}>
													{ displayCategoryList && 
														<div class="category-list w-clearfix" dangerouslySetInnerHTML={ { __html: post.categories_list } } />
													}
												</figure>
                                            </a>
                                        </header>
									) : (
										null
									)
                                }
                                
								<div class="entry-content">

									<h2 className={ `entry-title font-size-${titleFontSize}` }><a href={ post.link } target="_blank" rel="bookmark">{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }</a></h2>

                                    { post.get_post_type && 
                                        <div class="entry-meta">

												{ post.avatar_author && columns < 4 &&
													<span class="entry-meta-avatar" dangerouslySetInnerHTML={ { __html: post.avatar_author } } />
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

												{ post.count_comment && columns < 3 && columns != 1 &&
													<span class="comment-count"><span class="comments-link">{ post.count_comment }</span></span>
												}

                                        </div>
                                    }
									{ displayPostExcerpt &&
										<div className={ `posts-excerpt font-size-${bodyFontSize}` } dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } } />
									}
								</div>
							</article>
						) }
					</div>
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
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );
	const categoriesListQuery = {
        per_page: 100,
	};
	return {
		latestPosts: getEntityRecords( 'postType', 'post', latestPostsQuery ),
		categoriesList: getEntityRecords( 'taxonomy', 'category', categoriesListQuery ),
	};
} )( PostsBlock );