/**
 * BLOCK: Yasothon Blocks Columns
 */

// Import CSS
import './styles/style.scss';
import './styles/editor.scss';

import times from 'lodash/times';
import classnames from 'classnames';
import memoize from 'memize';

// Components
const { __ } = wp.i18n;

// Register block controls
const { 
    registerBlockType
} = wp.blocks;
const { 
    InspectorControls,
    InnerBlocks
} = wp.editor;
const { 
    PanelBody, 
	SelectControl
} = wp.components;
const { 
    Fragment
} = wp.element;

const ALLOWED_BLOCKS = [ 'yasothon/yasothon-column' ];

// const validAlignments = [ 'center', 'wide' ];

import { postColumns } from '../../components/icons/index.js';

const getColumnsTemplate = memoize( ( columns ) => {
	return times( columns, () => [ 'yasothon/yasothon-column' ] );
} );

// Register the block
registerBlockType( 'yasothon/yasothon-columns', {
	title: __( 'Columns', 'yasothon' ),
	description: __( 'Display Columns', 'yasothon' ),
	icon: postColumns,
	category: 'yasothon_blocks',
	keywords: [
		__( 'post', 'yasothon' ),
		__( 'posts', 'yasothon' ),
	],

	attributes: {
		columns: {
			type: 'string',
			default: '1',
		},
	},

	supports: {
		align: [ 'wide', 'full' ],
		html: false,
	},

    edit( { attributes, setAttributes, className } ) {
		const { columns } = attributes;
		const classes = classnames( className, `has-${ columns }-columns` );

		// Columns
        const columns_options = [
			{ value: '1', label: __( '1' ) },
            { value: '2', label: __( '2' ) },
            { value: '3', label: __( '3' ) },
			{ value: '4', label: __( '4' ) },
			{ value: '3-1', label: __( '3-1' ) },
			{ value: '1-3', label: __( '1-3' ) },
			{ value: '1-2-1', label: __( '1-2-1' ) },
		];

		var columns_block = 0;
		
		if (columns == '3-1' || columns == '1-3' ) {
			columns_block = 2;
		} else if ( columns == '1-2-1' ) {
			columns_block = 3;
		} else {
			columns_block = columns;
		}

		// console.log(columns_block);

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody>
						<SelectControl
							label={ __( 'Columns' ) }
							options={ columns_options }
							value={ columns }
							onChange={ ( nextColumns ) => {
								setAttributes( {
									columns: nextColumns,
								} );
							} }
						/>
					</PanelBody>
				</InspectorControls>
				<div className={ classes }>
	
					<InnerBlocks
						template={ getColumnsTemplate( columns_block ) }
						templateLock="all"
						allowedBlocks={ ALLOWED_BLOCKS } />
				</div>
			</Fragment>
		);
	},

	save( { attributes } ) {
		const { columns } = attributes;

		return (
			<div class="wrapper">
				<div className={ `wp-block-yasothon-yasothon-columns has-${ columns }-columns` }>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
