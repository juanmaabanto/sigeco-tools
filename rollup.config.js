import path from 'path';
import pkg from './package.json';

import propTypes from 'prop-types';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const external = id => !id.startsWith('.') && !path.isAbsolute(id);

const input = './src/index.js';
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-draggable': 'ReactDraggable',
  'react-virtualized': 'ReactVirtualized',
  '@material-ui/core/Accordion': 'MaterialUI.Accordion',
  '@material-ui/core/AccordionDetails': 'MaterialUI.AccordionDetails',
  '@material-ui/core/AccordionSummary': 'MaterialUI.AccordionSummary',
  '@material-ui/core/Checkbox': 'MaterialUI.Checkbox',
  '@material-ui/core/CircularProgress': 'MaterialUI.CircularProgress',
  '@material-ui/core/Icon': 'MaterialUI.Icon',
  '@material-ui/core/IconButton': 'MaterialUI.IconButton',
  '@material-ui/core/InputAdornment': 'MaterialUI.InputAdornment',
  '@material-ui/core/MenuItem': 'MaterialUI.MenuItem',
  '@material-ui/core/Paper': 'MaterialUI.Paper',
  '@material-ui/core/Select': 'MaterialUI.Select',
  '@material-ui/core/styles': 'MaterialUI',
  '@material-ui/core/styles/makeStyles': 'MaterialUI.makeStyles',
  '@material-ui/core/styles/withStyles': 'MaterialUI.withStyles',
  '@material-ui/core/TableSortLabel': 'MaterialUI.TableSortLabel',
  '@material-ui/core/TextField': 'MaterialUI.TextField',
  '@material-ui/core/Tooltip': 'MaterialUI.Tooltip'
};

const extensions = ['.js'];

const getBabelOptions = ({ useESModules }) => ({
    exclude: /node_modules/,
    runtimeHelpers: true,
    extensions,
    plugins: [['@babel/plugin-transform-runtime', { useESModules }]],
});

const commonjsOptions = {
    include: /node_modules/,
    namedExports: {
      'prop-types': Object.keys(propTypes),
      'node_modules/react-is/index.js': [
        'ForwardRef',
        'Memo'
      ]
    },
};

const onwarn = warning => {
    // ignore imported types
    if (warning.code === 'NON_EXISTENT_EXPORT') {
      return;
    }
    throw Error(String(warning));
};

export default [
    {
        input,
        external,
        onwarn,
        output: [{
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
        }, {
            file: pkg.module,
            format: 'es',
            sourcemap: true
        }, {
            file: pkg.types,
            format: 'es'
        }],
        plugins: [nodeResolve({ extensions }), babel(getBabelOptions({ useESModules: false }))]
    },
    {
        input,
        external: Object.keys(globals),
        onwarn,
        output: {
            globals,
            format: 'umd',
            name: 'SigecoTools',
            file: 'dist/sigeco-tools.umd.js'
        },
        plugins: [
            nodeResolve({ extensions }),
            babel(getBabelOptions({ useESModules: true })),
            commonjs(commonjsOptions),
            replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
            sizeSnapshot(),
            {
                transform(code, id) {
                    if (id.includes('@sigeco/tools')) {
                      throw Error('add @sigeco/tools imports to globals');
                    }
                }
            }
        ]
    },
    {
        input,
        external: Object.keys(globals),
        onwarn,
        output: {
        globals,
            format: 'umd',
            name: 'SigecoTools',
            file: 'dist/sigeco-tools.umd.min.js',
        },
        plugins: [
            nodeResolve({ extensions }),
            babel(getBabelOptions({ useESModules: true })),
            commonjs(commonjsOptions),
            replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
            sizeSnapshot(),
            terser()
        ]
    }
]