import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => ({
    root: {
        alignItems: 'center',
        display: 'flex',
        flex: '0 0 auto',
        justifyContent: 'flex-end',
        padding: '0.375rem 0.5rem',
        '@media (min-width: 701px)': {
          padding: '0.375rem 0.75rem',
        },
        '@media (min-width: 1401px)': {
          padding: '0.375rem 1rem'
        },
        '& > *': {
          marginLeft: '.5rem'
        }
    }
}))

const Footer = props => {
    const classes = useStyles();

    return (
      <div className={classes.root} style={{...props.style}}>
        {props.children}
      </div>
    );
}

Footer.propTypes = { }

export default Footer;