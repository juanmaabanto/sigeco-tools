import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

export const styles = {
  root: { }
};

const ActionField = React.forwardRef(function ActionField(props, ref) {
    const { 
        autoComplete = 'off', 
        autoFocus = false,
        classes, 
        className,
        disabled = false,
        error = false,
        fullWidth = true,
        helperText,
        hiddenAction = false,
        iconActionCls = 'fas fa-external-link-alt',
        label,
        placeholder,
        readOnly = true,
        value,
        variant = 'standard',
        onHandleAction,
        onKeyPress,
        ...other 
    } = props;

    const handleKeyPress = event => {
        if(typeof onKeyPress === "function" ) {
            onKeyPress(event);
        }

        if(event.key === 'Enter') {
            onHandleAction(event);
        }
    };

    return (
        <TextField
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            className={clsx(classes.root, className)}
            disabled={disabled}
            error={error}
            fullWidth={fullWidth}
            helperText={helperText}
            label={label}
            placeholder={placeholder}
            value={value}
            variant={variant}
            onKeyPress={handleKeyPress}
            InputProps={{
                endAdornment: !hiddenAction && (
                    <InputAdornment position="end">
                        <IconButton
                            disabled={disabled}
                            className={iconActionCls}
                            tabIndex={-1}
                            style={{ fontSize: '0.8125rem' }}
                            onClick={onHandleAction}
                        />
                    </InputAdornment>
                ),
                readOnly: readOnly
            }}
            ref={ref}
            {...other}
        />
    );
});

ActionField.propTypes = {
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    classes: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    fullWidth: PropTypes.bool,
    helperText: PropTypes.node,
    label: PropTypes.node,
    onHandleAction: PropTypes.func,
    onKeyPress: PropTypes.func,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    value: PropTypes.any,
    /**
     * The variant to use.
     * @default 'standard'
     */
    variant: PropTypes.oneOf(['filled', 'outlined', 'standard'])
};

export default withStyles(styles)(ActionField);