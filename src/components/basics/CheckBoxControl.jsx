import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Box, FormControlLabel } from '@mui/material';

const CheckBoxControl = (props) => {
 let itemTitle = props.title;
if (props.itemType == 340 &&  props.title == "Multilines")
{
  itemTitle = "Multiple Select"
}

  return (

    <Box display="flex" p={0}>
      <FormControlLabel
        control={<Checkbox
          className="form-checkbox"
          name={props.name}
          key={'chk' + props.name}
          type={'checkbox'}
          checked={props.controlValue}
          onChange={props.controlFunc}
          placeholder={itemTitle} />}
          label={itemTitle ? itemTitle : null}
      />
    </Box>

  )
};


CheckBoxControl.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  keyprop: PropTypes.string,
  controlFunc: PropTypes.func,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  placeholder: PropTypes.string,
};

export default CheckBoxControl
