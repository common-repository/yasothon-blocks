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

import { postStyle } from '../../components/icons/index.js';

// Register the block
registerBlockType( 'yasothon/yasothon-post-style-4', {
	title: __( 'Post Style 4', 'yasothon' ),
	description: __( 'Display posts style 4', 'yasothon' ),
	icon: postStyle,
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
