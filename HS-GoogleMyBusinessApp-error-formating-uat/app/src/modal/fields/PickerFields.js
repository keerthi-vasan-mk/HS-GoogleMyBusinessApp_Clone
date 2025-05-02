import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker, TimePicker } from '@material-ui/pickers';



const useStyles = makeStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      height: '40px'
    },
  },
});

/**
 * Function that renders the Date Picker field
 * in the Hootsuite dashboard.
 */
export const StyledDatePicker = (props) =>  {
  const { value, changeHandler } = props;
  const classes = useStyles();
  return (
    <DatePicker 
      className={classes.root}
      style={{ width: '100%', marginRight: '20px' }}
      value={value} 
      inputVariant="outlined"
      disablePast
      onChange={changeHandler} 
    />
  )
}

/**
 * Function that renders the Time Picker field
 * in the Hootsuite dashboard.
 */
export const StyledTimePicker = (props) =>  {
  const { value, changeHandler } = props;
  const classes = useStyles();
  return (
    <TimePicker 
      className={classes.root} 
      style={{ width: '100%' }}
      value={value} 
      inputVariant="outlined"
      onChange={changeHandler} 
    />
  )
}

