import React from 'react';
import PropTypes from 'prop-types';
import { InputLabel,Box } from '@mui/material';

const ColorControl = (props) =>

  (
    <Box display="flex" p={1} bgcolor="background.paper">
      <InputLabel className="form-label">{props.title ? props.title : null}</InputLabel>
      &nbsp;
    <input
        className="form-input"
        name={props.name}
        key={'bg_' + props.name}
        type={props.inputType}
        value={props.controlValue}
        onChange={props.controlFunc}
        placeholder={props.title} />
    </Box>
  )


  ColorControl.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string.isRequired,
  controlFunc: PropTypes.func,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  placeholder: PropTypes.string,
};

export default ColorControl
