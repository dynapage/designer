import React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { InputLabel, Box } from '@mui/material';

const ToggleButtons = (props) => {
  const [alignment, setAlignment] = React.useState(props.controlValue);

  const handleAlignment = (event, newAlignment) => {
    !newAlignment ? setAlignment('1') : setAlignment(newAlignment);
    props.controlFunc(newAlignment);
  };

  return (
    <Box p={1}>
      <InputLabel className="form-label">{props.title ? props.title : null}</InputLabel>
      <ToggleButtonGroup
        size={props.size}
        value={alignment}
        orientation={props.orientation}
        name={props.name}
        disabled={props.isDisabled}
        key={'bg' + props.name}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        {props.options.map(opt => {
          return (
            <ToggleButton key={'toggleb' + opt.key} value={opt.key} aria-label="centered">{opt.value}</ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};

ToggleButtons.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default ToggleButtons;
