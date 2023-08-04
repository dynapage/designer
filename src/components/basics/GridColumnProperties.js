import React from 'react';
import GridSimplePropertyForm from './GridSimplePropertyForm';
import GridNumericField from './GridNumericField';
import GridCustomField from './GridCustomField';
import DatePickerProperties from './DatePickerProperties';
import GridTableRefProperties from './GridTableRefProperties';
import ToggleButtons from './ToggleButtons';
import CheckBoxControl from './CheckBoxControl';
import { InputLabel, Input, TextField, Box, } from '@mui/material';
import TextBoxControl from './TextBoxControl';


const operator = [{ key: 1, value: 'Yes/No' }, { key: 2, value: 'On/Off' }, { key: 3, value: 'True/False' }];
const dateControlformat = [{ key: 1, value: 'Date' }, { key: 2, value: 'Date/Time' }, { key: 3, value: 'Time' }];

export default function GridColumnProperties({ columns, columnData, handlePropsChange, showProperty }) {

  // //console.log(columnData, '++++++++++++++==columnData============columnData======GridCustomField:')
  const handleTypeChange = (e) => {
    const data = { ...columnData };
    data.texttype = e;
    handlePropsChange(data)
  };

  const handleEditableChange = (e) => {
    const data = { ...columnData };
    data['editable'] = e.target.checked;
    handlePropsChange(data)
  };
  const handleMultiChoiceChange = (e) => {
    const data = { ...columnData };
    data['multiline'] = e.target.checked;
    handlePropsChange(data)
  };

  const setInputValues = (e) => {
    const data = { ...columnData };
    data['width'] = e.target.value;
    handlePropsChange(data)
  };



  //console.log(columnData, 'GridNumericField-- columnData ===============================----', columnData.type);
  if (showProperty) {
    switch (columnData.type) {
      //text
      case 301:
        return (
          <GridSimplePropertyForm handlePropsChange={handlePropsChange} columnData={columnData} />
        );
      //number
      case 302:
        return (
          <Box p={0}>
            <InputLabel>{'Editable?'}</InputLabel>
            <CheckBoxControl key={'editablecellcheck'} name={'editable'} controlFunc={handleEditableChange} controlValue={columnData.editable} />
            &nbsp;&nbsp;
            <Box p={0}>
              <InputLabel  >{'Column Width'}</InputLabel>
              <TextBoxControl key={'width11'} name={"width"} controlFunc={setInputValues} inputType={"number"} title={"Column Width"} controlValue={columnData.width} defaultValue={150} />
            </Box>
            <GridNumericField handlePropsChange={handlePropsChange} columnData={columnData} />
          </Box>

        );
      //custom Numeric Column
      case 303:
        return (
          <GridCustomField withoutSave={true} data={columnData} columnData={columnData} handlePropsChange={handlePropsChange}  columns={columns} />
        );
      //date
      case 320:
        return (

          // <DatePickerProperties handlePropsChange={handleTypeChange} controlValue={columnData.texttype}></DatePickerProperties>

          <Box display="flex" p={0}>
            <Box p={0}>
              <InputLabel>{'Editable?'}</InputLabel>
              <CheckBoxControl key={'editablecellcheck'} name={'editable'} controlFunc={handleEditableChange} controlValue={columnData.editable} />
            </Box>
            &nbsp;&nbsp;
            <Box p={0}>
              <InputLabel>{'Column Width'}</InputLabel>
              <TextBoxControl key={'width12'}  name={"width"} controlFunc={setInputValues} inputType={"number"} title={"Column Width"} controlValue={columnData.width} defaultValue={150} />
            </Box>
            <Box p={1} >
              <ToggleButtons key={'formattype'} size={"small"} name={'formattype'} controlFunc={handleTypeChange} options={dateControlformat} title={'Select picker type'} controlValue={columnData.texttype} />
            </Box>
          </Box>

        );
      //Boolean
      case 330:
        return (
          <Box p={0}>
            <InputLabel>{'Editable?'}</InputLabel>
            <CheckBoxControl key={'editablecellcheck'} name={'editable'} controlFunc={handleEditableChange} controlValue={columnData.editable} />
            <ToggleButtons key={'booleanControl'} size={"small"} name={'booleanControl'} controlFunc={handleTypeChange} options={operator} title={columnData.label} controlValue={columnData.texttype} />
          </Box>
        );
      //Table Ref
      case 307:
        return (
          <GridTableRefProperties handlePropsChange={handlePropsChange} columnData={columnData} showRedirect={true}/>

        );//list
      case 340:
        return (
          <Box p={0}>
            <InputLabel>{'Editable?'}</InputLabel>
            <CheckBoxControl key={'editablelitcbo'} name={'editable'} controlFunc={handleEditableChange} controlValue={columnData.editable} />
            &nbsp;&nbsp;
            <Box p={0}>
              <InputLabel  >{'Column Width'}</InputLabel>
              <TextBoxControl key={'width15'}  name={"width"} controlFunc={setInputValues} inputType={"number"} title={"Column Width"} controlValue={columnData.width} defaultValue={150} />
            </Box>
            <InputLabel>{'Multiple Choices?'}</InputLabel>
            <CheckBoxControl key={'multilinechoicecboe'} name={'multiline'} controlFunc={handleMultiChoiceChange} controlValue={columnData.multiline} />
          </Box>
        );
      case 341:
        return (
          <GridTableRefProperties handlePropsChange={handlePropsChange} columnData={columnData} showRedirect={true} />
        );
      //image
      case 370:
        return (
          null
        );
      //file
      case 380:
        return (
          null
        );

      default:
        return (
          <Box display="flex" flexDirection="row" p={1} m={1} >
            <Box p={1}>
              <InputLabel className="form-label">{columnData.label}</InputLabel>
              <Box display="flex" p={1} >
                <Input
                  className="form-input"
                  name={columnData._id}
                  key={columnData._id}
                  disabled
                  value={'No property available'}
                  placeholder={columnData.label} />
              </Box>
            </Box></Box>
        );
    }
  }
  else { return (null) }


};



