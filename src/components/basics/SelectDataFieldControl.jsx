import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { InputLabel, Select, MenuItem , Box } from '@mui/material';


const useStyles = makeStyles((theme) => ({

  formControl: {
    minWidth: 250,
  },
}));

const SelectDataFieldControl = (props) => {
  const classes = useStyles();
  const { controlType, options } = props;

  ////console.log(  '::::: Property Control Rendering ::::: ', props);

  const generateFieldList = () => {
    let genericType = '';
    if (controlType <= 20) {
      genericType = 'string'
    }
    else if (controlType > 29 && controlType < 40) {
      genericType = 'bool'
    }
    else if (controlType > 39 && controlType < 50) {
      genericType = 'list'
    }
    else {
      genericType = 'string0'
    }
    return genericType;
  }

  // if not data grid
if (props.controlType != 50)
{
  return (
    <Box component="span" className={classes.formControl} display="block" my={2} whiteSpace="nowrap">
      <InputLabel className="form-label">{props.title ? props.title : null}</InputLabel>
      <Select
        name={props.name ? props.name : null}
        value={props.controlValue}
        onChange={props.controlFunc}
        disabled={controlType >= 100}
        className="form-select">
        {
          Object.entries(options).map(([key, opt]) => {
            switch (generateFieldList()) {
              case 'string':
                if (controlType == 301 || controlType == 302 || controlType == 320) {
                  return (
                    <MenuItem key={opt.shapevalue} value={opt.shapevalue}>{opt.label}</MenuItem>
                  )
                }
                break;
              case 'bool':
                if (controlType == 330) {

                  return (
                    <MenuItem key={opt.shapevalue} value={opt.shapevalue}>{opt.label}</MenuItem>
                  )
                }
                break;
              case 'list':
                if (controlType == 340 || controlType == 341) {
                  return (
                    <MenuItem key={opt._id} value={opt.name}>{opt.name}</MenuItem>
                  )
                }
                break;
              default:
                return (
                  <MenuItem key={opt._id} value={opt.name}>{opt.name}</MenuItem>
                )
            }
          })}
      </Select>
    </Box>
  )
}
else
{
  return(
    null
  )
}


}


SelectDataFieldControl.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default SelectDataFieldControl;
