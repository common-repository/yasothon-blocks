/**
 * BLOCK: Yasothon Blocks Posts
 */

// Import block dependencies and components
import edit from './edit';

// Import CSS
import './styles/style.scss';

// Components
const { __ } = wp.i18n;

// Register block controls
const {
	registerBlockType,
} = wp.blocks;

const validAlignments = [ 'center', 'wide' ];

import { featuredPosts } from '../../components/icons/index.js';

// Register the block
registerBlockType( 'yasothon/yasothon-featured-posts', {
	title: __( 'Featured Post', 'yasothon' ),
	description: __( 'Display featured posts.', 'yasothon' ),
	icon: featuredPosts,
	category: 'yasothon_blocks',
	keywords: [
		__( 'post', 'yasothon' ),
		__( 'posts', 'yasothon' ),
	],

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( -1 !== validAlignments.indexOf( align ) ) {
			return { 'data-align': align };
		}
	},

	edit,

	// Render via PHP
	save() {
		return null;
	},
} );
