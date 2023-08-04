import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import CheckBoxControl from './CheckBoxControl';
import TextBoxControl from './TextBoxControl';
import { InputLabel, Select, MenuItem, Box, } from '@mui/material';


export default function GridSimplePropertyForm({ handlePropsChange, columnData }) {
  
  const { appforms } = useSelector((state) => state.application.value);


  const cards = [{ key: 1, value: 'Text' }, { key: 2, value: 'Password' }, { key: 3, value: 'Email' }, { key: 4, value: 'URL' }];
  const [showURL, setShowURL] = useState(columnData.formattype === 4);
  const [data, setData] = useState();

  useEffect(() => {
    setData(columnData)
  }, [columnData]);

  const setPropertyValues = (colname, value) => {

    console.log('-----------appforms:', appforms)

    //const selectedForm = appforms.find((frm) => frm._id == value);

    setData({ ...data, [colname]: value })
    if (colname === 'formattype') {
      if (value === 4 || value === 4) {
        setShowURL(true)
      }
      else {
        setShowURL(false)
      }
    }
    let newColumnData = ({ ...columnData, ...data })

    handlePropsChange({ ...newColumnData, [colname]: value });
  };

  const setInputValues = (e) => {
    setPropertyValues(e.target.name, e.target.value)
  };

 

  return (
    <div style={{ width: '100%' }}>
      {data?
      <Box display="flex" flexDirection="row" p={0}>
        
        <Box p={0}>
          <InputLabel  >{'Editable?'}</InputLabel>
          <CheckBoxControl key={'editablecell'} name={'editable'} controlFunc={e => { setPropertyValues('editable', e.target.checked) }} controlValue={data.editable} />
        </Box>&nbsp;&nbsp;
        <Box p={0}>
          <InputLabel  >{'Column Width'}</InputLabel>
          <TextBoxControl name={"width"} controlFunc={setInputValues} inputType={"number"} title={"Column Width"} controlValue={data.width} defaultValue={150} />
        </Box>
        <Box p={0}>
          <InputLabel  >{'Column Title (label)'}</InputLabel>
          <TextBoxControl name={"label"} controlFunc={setInputValues} inputType={"text"} title={"Column Title"} controlValue={data.label} />
        </Box>
        <Box p={0}>
          <InputLabel  >{'Cell format'}</InputLabel>
          <Select
            style={{ "minWidth": "120px" }}
            name={'formattype'}
            value={data.formattype}
            onChange={e => setPropertyValues(e.target.name, e.target.value)}
            className="form-select">
            <MenuItem key={'nonselected1'} value={data.placeholder}></MenuItem>
            {cards.map(opt => {
              return (
                <MenuItem key={opt.key} value={opt.key}>{opt.value}</MenuItem>
              );
            })}
          </Select>
        </Box>
        {showURL ?
          <Box p={0}>
            <InputLabel  >{'URL redirect to'}</InputLabel>
            <Select
              name={'redirectto'}
              style={{ "minWidth": "120px" }}
              disabled={!showURL}
              value={data.redirectto}
              onChange={e => setPropertyValues(e.target.name, e.target.value)}>
              {/* <MenuItem key={'nonselected2'} value={data.placeholder}></MenuItem> */}
              <MenuItem disabled key={'nonselected2'} value="choose">Choose Option</MenuItem>
              {appforms && appforms.length && appforms.map((value) => {
                //if (value.formSchemaRef != selectedTable)
                return (
                  <MenuItem key={value._id} value={value._id}>{value.label}</MenuItem>
                );
              })}
            </Select>
            <CheckBoxControl key={'popupform'} name={'popupform'} controlFunc={e => { setPropertyValues(e.target.name, e.target.checked) }} title={'pop-up form?'} controlValue={data.popupform} />
          </Box>
          :
          null
        }
      </Box>
:
null}
    </div>
  )
};

GridSimplePropertyForm.propTypes = {
  inputType: PropTypes.oneOf(['text', 'number']),
  label: PropTypes.string,
  controlFunc: PropTypes.func,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  placeholder: PropTypes.string,
};


