import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from "react-router-dom";
import { Select, MenuItem, Box, InputLabel } from '@mui/material';
import CheckBoxControl from './CheckBoxControl';
import TextBoxControl from './TextBoxControl';
import ToggleButtons from './ToggleButtons';

// import { fetchTableByColumnId } from 'redux/actions/columns';
// import { fetchFormsByTableId } from 'redux/actions/forms';

import columnApi from '../../api/columnApi';
import formApi from '../../api/formApi';

//fetchFormsByTableId
const controlformat = [{ key: 1, value: 'Text mode' }, { key: 2, value: 'URL - auto generated form' }, { key: 3, value: 'URL - Re direct to a form' }];

const GridTableRefProperties = ({ handlePropsChange, columnData, showRedirect }) => {



  const { selectedApp } = useSelector((state) => state.applications);
  //const { appforms } = useSelector((state) => state.tables);
  const [tmpdata, setData] = useState({
    editable: columnData.editable ? columnData.editable : false,
    formattype: columnData.formattype,
    popupform: columnData.popupform,
    redirectto: columnData.redirectto,
    gridtofilter: columnData.gridtofilter,
  });
  const [GridList, setGridList] = useState();
  const [availableGrids, setavailableGrids] = useState();
  const location = useLocation();
  const dispatch = useDispatch();
  const { selectedForm } = location.state;



  useEffect(() => {
    const gridList = async () => {
      const data = await columnApi.getTableByColumnId(location.state.appId, columnData.datarefid);
      setGridList(data);
    }
    gridList();

  }, [selectedApp]);

  useEffect(() => {
    try {
      if (GridList) {
        const gridList = async () => {
          if (GridList._id) {
            const data = await formApi.getFormsByTableId(location.state.appId, GridList._id);
            setavailableGrids(data);
          }
        }
        gridList();
      }
    }
    catch (err) {
      console.log('@443__   ' , err)
    }
  }, [GridList]);



  const setPropertyValues = (ctrlname, value) => {

    //formDataRef
    const result = availableGrids.find(({ _id }) => _id === value);

    setData({ ...tmpdata, [ctrlname]: value, gridtofilter: result ? result.formDataRef : "" })
    let data = { ...columnData, ...tmpdata, [ctrlname]: value, gridtofilter: result ? result.formDataRef : "" };


    //  data.redirectto = value;
    //data.formattype = false;

    handlePropsChange(data);
  };


  const handleIsTop = (e) => {
    setData({ ...tmpdata, popupform: e.target.checked })
    let data = { ...columnData, ...tmpdata, popupform: e.target.checked }
    //data.formattype = e.target.checked;
    data.redirectto = '';
    handlePropsChange(data);
  };

  const handleDataChange = (e) => {
    //console.log(e, '--------------Now we are ready.??....handleDataChange...............');
    setData({ ...tmpdata, formattype: e, popupform: false, gridtofilter: "", redirectto: "" })
    let data = { ...columnData, ...tmpdata, formattype: e, popupform: false, gridtofilter: "", redirectto: "" }
    handlePropsChange(data);


  };

  ////console.log('================setPropertyValues=============================', tmpdata)

  return (
    <Box p={0}>

      <Box m={1} p={0}>
        <InputLabel>{'Editable?'}</InputLabel>
        <CheckBoxControl key={'editablecell2' + tmpdata._id} name={'editable' + tmpdata._id} controlFunc={e => { setPropertyValues('editable', e.target.checked) }} controlValue={tmpdata.editable} />
      </Box>
      &nbsp;&nbsp;
      <Box p={0}>
        <InputLabel  >{'Column Width'}</InputLabel>
        <TextBoxControl name={"width"} controlFunc={e => { setPropertyValues('width', e.target.value) }} inputType={"number"} title={"Column Width"} controlValue={columnData.width} defaultValue={150} />
      </Box>
      <Box display="flex" justifyContent="flex-center" m={1} p={0}>
        <ToggleButtons size={"small"} key={'colstruct'} name={'colstruc'} controlFunc={(e) => handleDataChange(e)} options={controlformat} title={columnData.label + ' (Select format) '} controlValue={tmpdata.formattype} />
      </Box>
      <Box display="flex" justifyContent="flex-start" m={1} >
        {columnData.formattype == 2 ?
          // <CheckBoxControl name={'RefURL'} controlFunc={handleIsTop} title={'URL to auto generated form?'} controlValue={tmpdata.popupform} />
          <p>Auto generated Form (Pop-up modal form) for viewing or editing entire selected record columns</p>
          :
          null}
        {tmpdata.formattype == 3 ?
          <div>
            <p>This is (Many: [{selectedForm.label}] to One: [selected value below]) relationship<br></br>Only related records will be shown in selected form</p>
            <Select
              name={'redirect_to' + columnData._id}
              style={{ "minWidth": "120px" }}
              value={tmpdata.redirectto}
              onChange={(e) => setPropertyValues('redirectto', e.target.value)}>
              <MenuItem disabled value="choose">Choose Option</MenuItem>
             
              {availableGrids && availableGrids.length > 0 && availableGrids.map((value) => {
               // console.log('-----------setProp  availableGrids  ertyValues00000000000------', value);
                return (
                  <MenuItem  key={value._id} value={value._id}>{value.label}</MenuItem>
                );
              })}
            </Select>
            <CheckBoxControl key={'popupform'} name={'popupform'} controlFunc={e => { setPropertyValues(e.target.name, e.target.checked) }} title={'pop-up form?'} controlValue={tmpdata.popupform} />
            {/* <Select
              name={'gridtofilter' + columnData._id}
              style={{ "minWidth": "120px" }}
              value={tmpdata.gridtofilter}
              onChange={e => setPropertyValues('gridtofilter', e.target.value)}>
              <MenuItem name={'nonselected3'} key={'nonselected3'} value={''}></MenuItem>
              {availableGrids && availableGrids.map((value) => {
                //console.log('##########', value)
                return (
                  <MenuItem name={value._id} key={value._id} value={value._id}>{value.label}</MenuItem>
                );
              })}
            </Select> */}
          </div>
          :
          null}

      </Box>
      <Box display="flex" justifyContent="flex-start" m={1} > </Box>
    </Box>
  )
}


export default GridTableRefProperties
