import React from 'react';
import PropTypes from 'prop-types';
import { Input, FormControl, InputLabel, Box } from '@mui/material';

const TextBoxControl = (props) =>
(

  <Box sx={{
    minWidth: 120, p: 1,
    m: 1,
  }}>
    <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">{props.title ? props.title : null}</InputLabel>
      <Input
        size='small'
        name={props.name}
        // key={props.key}
        type={props.inputType}
        required={props.required}
        defaultValue={props.defaultValue}
        value={props.controlValue}
        onChange={props.controlFunc}
        placeholder={props.title} />
    </FormControl>
  </Box>
)


TextBoxControl.propTypes = {
  inputType: PropTypes.oneOf(['text', 'number']),
  title: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  controlFunc: PropTypes.func,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  placeholder: PropTypes.string,
};

export default TextBoxControl
