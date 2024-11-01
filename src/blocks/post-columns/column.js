const { __ } = wp.i18n;

const { 
    InnerBlocks
} = wp.editor;

const { 
    registerBlockType
} = wp.blocks;

import { postColumns } from '../../components/icons/index.js';

registerBlockType( 'yasothon/yasothon-column', {

    title: __( 'Column' ),

	parent: [ 'yasothon/yasothon-columns' ],

	icon: postColumns,

	description: __( 'A single column within a columns block.' ),

	category: 'yasothon_blocks',

	supports: {
		inserter: false,
		reusable: false,
		html: false,
	},

	edit() {
		return <InnerBlocks templateLock={ false } />;
	},

	save() {
		return <div><InnerBlocks.Content /></div>;
	},

});