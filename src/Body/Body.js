import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        padding: '0 .5rem .125rem',
        overflowY: 'auto',
        '@media (min-width: 701px)': {
            padding: '0 .75rem .375rem'
        },
        '@media (min-width: 1401px)': {
            padding: '0 1rem .625rem'
        }
    }
}))

const Body = props => {
    const classes = useStyles();

    return (
        <div className={classes.root} style={{...props.style}}>
            {props.children}
        </div>
    );
}

Body.propTypes = { }

export default Body;