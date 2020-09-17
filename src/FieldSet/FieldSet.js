import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Icon from '@material-ui/core/Icon';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(() => ({
    icon: {
        color: '#3c4858',
        fontSize: '0.8125rem',
        paddingRight: 6
    },
    iconCollapse: {
        color: '#3c4858',
        fontSize: '1.25rem'
    },
    title: {
        display: 'flex',
        fontSize: '0.8125rem',
        minHeight: '1.75rem',
        padding: '0 0.75rem 0 0.75rem'
    },
    titleContent: {
        alignItems: 'center',
        display: 'flex'
    }
}));

const FieldSet = props => {
    const classes = useStyles();
    const { className, defaultExpanded, expandable, iconCls, title } = props;

    if(expandable) {
        return (
            <Accordion className={className} defaultExpanded={defaultExpanded}>
                <AccordionSummary
                    className={classes.title}
                    expandIcon={<Icon className={clsx("fas fa-angle-down", classes.iconCollapse)} />}
                >
                    <div className={classes.titleContent}>
                        <Icon className={clsx(iconCls, classes.icon)}/>
                        <div style={{ flexGrow: 1 }}>{title}</div>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {props.children}
                </AccordionDetails>
            </Accordion>
        );
    }

    return (
        <Paper className={className}>
            <div className={classes.title}>
                <div className={classes.titleContent}>
                    <Icon className={clsx(iconCls, classes.icon)}/>
                    <div>{title}</div>
                </div>
            </div>
            {props.children}
        </Paper>
    );
}

FieldSet.propTypes = {
    className: PropTypes.string,
    defaultExpanded: PropTypes.bool,
    expandable: PropTypes.bool,
    iconCls: PropTypes.string,
    title: PropTypes.string
}

export default FieldSet;