import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import SelectControlfromObject from './SelectControlfromObject';

const DropDownConditions = (props) => {

  const { controlValue, data } = props;
  const defaultProps = {
    bgcolor: 'background.paper',
    m: 1,
    border: 1,
  };

  function GetShapes() {
    let oShape = [];
    Object.entries(data).map(([key, opt]) => {
      const { children } = opt;
      children.map((item) => {
        if (item.children) {
          Object.entries(item.children).map(([key, child]) => {
            oShape.push(child);

          })
        }

      })
    })
    return oShape;
  };


  //console.log('................child, ..', controlValue);
  const setControlProperty = (event, parentPropName, chilePropName) => {
    props.conditionProperty(parentPropName, chilePropName, event.target.value)
  };

  const setControlPropertyCondition = (event, parentPropName, chilePropName) => {
    props.conditionProperty(parentPropName, chilePropName, event.target.checked)
  };


  return (
    <Box display="flex" justifyContent="left"> <label className="form-label">{props.name}</label>
      <Box borderColor="primary.main" {...defaultProps} >
        <FormControl>
          <Box borderColor="primary.main" {...defaultProps} >
            <Checkbox
              checked={(controlValue.showControlArea)}
              name='showControlArea'
              onChange={(e) => setControlPropertyCondition(e, 'showControlArea', false)}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            /><label className="form-label">show / hide control  on this form</label>
            {(controlValue.showControlArea) ?
              <Box borderColor="primary.main" {...defaultProps} >
                <label className="form-label">show / hide control  on this form</label>
                <SelectControlfromObject key={'controlidone'} name={'controlid'} internalID={true} controlFunc={(e) => setControlProperty(e, 'ShowControl', 'controlid')} options={GetShapes()} dataField={'ItemsShapes'} controlColumn={false} title={'itemsItemsShapes'} controlValue={controlValue.ShowControl.controlid} />
                <br></br>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={controlValue.ShowControl.show}
                      onChange={(e) => setControlPropertyCondition(e, 'ShowControl', 'show')}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="Hide?"
                />
              </Box>
              : null}
          </Box>


          <Box borderColor="primary.main" {...defaultProps} >
            <Checkbox
              checked={(controlValue.showSectionArea)}
              name='showSectionArea'
              onChange={(e) => setControlPropertyCondition(e, 'showSectionArea', false)}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            /><label className="form-label">show / hide section on this form</label>
            {(controlValue.showSectionArea) ?
              <Box borderColor="primary.main" {...defaultProps} >
                <label className="form-label">show / hide section on this form</label>
                <select
                  name={'cboSectionslist'}
                  value={controlValue.showSection.sectionid}
                  onChange={(e) => setControlPropertyCondition(e, 'showSection', 'sectionid')}
                  className="form-select">
                  <option value="">{props.placeholder}</option>
                  {data && Object.entries(data).map(([key, value]) => {
                    return (
                      <option
                        key={key}
                        value={value.id}>Section {key}</option>
                    );
                  })}
                </select>
                <br></br>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={controlValue.showSection.show}
                      onChange={(e) => setControlPropertyCondition(e, 'showSection', 'show')}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="Hide?"
                />
              </Box>
              : null}
          </Box>
          <Box borderColor="primary.main" {...defaultProps} >
            <Checkbox
              checked={(controlValue.showFormArea)}
              name='showFormArea'
              onChange={(e) => setControlPropertyCondition(e, 'showFormArea', false)}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            /><label className="form-label">set a control value on this form to</label>
            {(controlValue.showFormArea) ?
              <Box borderColor="primary.main" {...defaultProps} ><label className="form-label">Select the control to set its value: </label>
                <br></br>
                <SelectControlfromObject key={'itemsItemsShapes2'} name={'itemsItemsShapes2'} controlFunc={(e) => setControlProperty(e, 'SetValueControl', 'valueid')} internalID={true} options={GetShapes()} dataField={'ItemsShapes2'} controlColumn={false} title={'itemsItemsShapes2'} controlValue={controlValue.SetValueControl.valueid} />
                <br></br>
                <label className="form-label">Set value to: (either: static text, value of another drop down, date, nummber, user, sum</label>
                <div>
                  <TextField label="Size" key="standard-basic" label="Value" onChange={(e) => setControlProperty(e, 'SetValueControl', 'setValueProperty')} value={controlValue.SetValueControl.setValueProperty} />
                </div>
                <br></br>
              </Box>
              : null}
          </Box>
          <Box borderColor="primary.main" {...defaultProps} >
            <Checkbox
              checked={(controlValue.showMessageArea)}
              name='showMessageArea'
              onChange={(e) => setControlPropertyCondition(e, 'showMessageArea', false)}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            /><label className="form-label">Show a message</label>
            {(controlValue.showMessageArea) ?
              <Box borderColor="primary.main" {...defaultProps} ><label className="form-label">Show a message</label></Box>
              : null}
          </Box>
        </FormControl>
      </Box>
    </Box>
  )

};

DropDownConditions.propTypes = {
  name: PropTypes.string.isRequired,
  selectedOption: PropTypes.string,
  conditionProperty: PropTypes.func,
  placeholder: PropTypes.string
};

export default DropDownConditions;
