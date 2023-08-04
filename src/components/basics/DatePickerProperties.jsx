import React from 'react';
import { InputLabel, Box } from '@mui/material';
import ToggleButtons from './ToggleButtons';
import CheckBoxControl from './CheckBoxControl';

const controlformat = [{ key: 1, value: 'Date' }, { key: 2, value: 'Date/Time' }, { key: 3, value: 'Time' }];

const DatePickerProperties = ({ controlValue, handlePropsChange }) => {

  const handleFormattype = (event) => {
    //console.log(event)
    handlePropsChange(event)
  };

  return (

    <Box display="flex" p={0}>
      <Box p={0}>
        <InputLabel  >{'Editable?'}</InputLabel>
        <CheckBoxControl key={'editablecellcheck'} name={'editable'} controlFunc={handleTypeChange} controlValue={controlValue} />
      </Box>
      <Box p={1} >
        <ToggleButtons size={"small"} key={'formattype'} name={'formattype'} controlFunc={handleFormattype} options={controlformat} title={'Select picker type'} controlValue={controlValue} />
      </Box>
    </Box>
  )
}


export default DatePickerProperties
