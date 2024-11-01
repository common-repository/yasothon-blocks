

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
	Spinner,
	TextControl
} = wp.components;

const {
	InspectorControls,
	BlockAlignmentToolbar,
    BlockControls
} = wp.editor;

class PostsBlock extends Component {

	render() {
		const { attributes, categoriesList, setAttributes, latestPosts } = this.props;
        const { postTitle, align, order, orderBy, categories, postsToShow } = attributes;

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
                </PanelBody>
				<TextControl
					label={ __( 'Title' ) }
					type="text"
					value={ postTitle }
					onChange={ postTitle => setAttributes( { postTitle } ) }
				/>
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
					) }
				>
    
					<div
						className={ classnames([ 
                            `posts-list`
						] ) }
					>
						<div class="post-title-sidebar">{ postTitle }</div>

                        { displayPosts.map( ( post, i ) => 
                        
							<article
								key={ i }
								className={ classnames(
									post.featured_image_src ? 'has-thumbnail' : 'no-thumbnail'
								) }
							>
							    {
									post.featured_image_src !== undefined && post.featured_image_src ? (
                                        <header class="entry-header">
                                            <figure class="post-thumbnail">
                                                <a href={ post.link } target="_blank" rel="bookmark">
                                                    <div class="post-thumbnail-image" style={{ backgroundImage: `url(${ post.featured_image_src })` }} ></div>
                                                </a>
                                            </figure>
                                        </header>
									) : (
										null
									)
                                }
                                
								<div class="entry-content">

									<h2 class="entry-title"><a href={ post.link } target="_blank" rel="bookmark">{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }</a></h2>

                                    { post.get_post_type && 
                                        <div class="entry-meta">

                                        {  post.date_gmt &&
                                            <span class="posted-on">
                                                <a href={ post.link } rel="bookmark" target="_blank">
                                                    <time class="entry-date published" dateTime={ moment( post.date_gmt ).utc().format() }>{ moment( post.date_gmt ).local().format( 'MMMM DD, Y' ) }</time>
                                                </a>
                                            </span>
                                        }

                                        </div>
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