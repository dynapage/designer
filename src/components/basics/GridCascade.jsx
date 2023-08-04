import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import { getData, putData, postData, deleteData } from 'helpers/Axdata';
//import { getGrids } from 'redux/actions/columns';

import { Select, InputLabel, MenuItem, Box, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import CheckBoxControl from './CheckBoxControl';
import ToggleButtons from './ToggleButtons';
import { useLocation } from "react-router-dom";
import columnApi from '../../api/columnApi';


const GridCascade = ({ cascade, ShowEvent, controlProperties, formId }) => {


  const { data } = useSelector((state) => state.sections);
  const { apptables } = useSelector((state) => state.application.value);
  const [conditions, setconditions] = useState(cascade);
  const [availableGrids, setavailableGrids] = useState();
  const [sourceTableColumns, setSourceTableColumns] = useState();
  const [targetTableColumns, setTargetTableColumns] = useState();
  const [showContent, setShowContent] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();


  const getRefColumns = async (tblId, isSource) => {
    const dynadata = await columnApi.getAll(location.state.appId, tblId);
    if (isSource) {
      setSourceTableColumns(dynadata);
    }
    else {
      setTargetTableColumns(dynadata);
    }
  };

  useEffect(() => {
    fetchData();
    getRefColumns(controlProperties.datarefid, true);
  }, [data]);

  async function fetchData() {
    try {
      const gridList = await columnApi.getGrids(location.state.appId)
      var filteredGridList = [];

      gridList.map((item) => {

        if (item.formid == formId) {
          filteredGridList.push(item);
        }
      });
      setavailableGrids(filteredGridList);
      setShowContent(true);
    } catch (e) {
      if (e !== "No current user") {
        alert('@5633--'+ e);
      }
    }
  };

  const handleGridName = (newCondition, val) => {
    const selectedGrid = availableGrids.find(({ _id }) => _id === val);
    if (val == '') {
      setconditions({ ...conditions, [newCondition]: val, griddataref: '', fldname1: '' });
    }
    else {
      setconditions({ ...conditions, [newCondition]: val, griddataref: selectedGrid.dataref });
    }

    apptables.map((item) => {
      //const { dataref } = selectedGrid;
      if (selectedGrid)
        if (item.name === selectedGrid.dataref) {
          getRefColumns(item._id, false);
        }
    });
  };

  const handleSourceColumn = (newCondition, val) => {
    setconditions({ ...conditions, [newCondition]: val });
  };

  const handleTargetColumn = (newCondition, val) => {
    setconditions({ ...conditions, [newCondition]: val });
  };

  const validateToSubmit = () => {
    if (conditions.gridref.trim() === '') {
      alert("Data Grid not selected from dropdown.");
      return
    };

    if (conditions.fldname1.trim() === '') {
      alert("Column mapping (from) is not selected.");
      return
    };

    if (conditions.fldname2.trim() === '') {
      alert("Column mapping (to) is not selected.");
      return
    };

    ShowEvent(conditions, true)
  };

  return (
    availableGrids && availableGrids.length > 1 ?
      <Box p={0}>
        {showContent ?
          <Box>
            <FormControl variant="standard" sx={{ m: 0, minWidth: 420 }}>
              <Box
                sx={{
                  p: 1,
                  m: 1,
                }}>
                <InputLabel id="demo-simple-select-standard-label">Filter another grid based on this grid selection</InputLabel>
                <Select
                  name={'gridtocascade'}
                  style={{ "minWidth": "120px" }}
                  value={conditions.gridref}
                  onChange={e => handleGridName('gridref', e.target.value)}>

                  <MenuItem key={'nonselected4'} name={'nonselected4'} value=''>
                    <em>None</em>
                  </MenuItem>
                  {availableGrids && availableGrids.map((value) => {
                    // do not return your own grid
                    if (controlProperties.id != value._id)
                      return (
                        <MenuItem key={value._id} value={value._id}>{value.label} ({value.dataref})</MenuItem>
                      );
                  })}
                </Select>
              </Box>
            </FormControl>
            <br />
            <FormControl variant="standard" sx={{ m: 0, minWidth: 320 }}>
              <Box
                sx={{
                  p: 1,
                  m: 1,
                }}>
                <InputLabel id="demo-simple-select-standard-label">Column mapping (from)</InputLabel>
                <Select
                  name={'gridtofldname1'}
                  style={{ "minWidth": "120px" }}
                  value={conditions.fldname1}
                  onChange={e => handleSourceColumn('fldname1', e.target.value)}>
                  <MenuItem key={'nonselected5'} name={'nonselected5'} value=''>
                    <em>None</em>
                  </MenuItem>
                  {sourceTableColumns && sourceTableColumns.map((value) => {
                    return (
                      <MenuItem key={value._id} value={value.shapevalue}>{value.label}</MenuItem>
                    );
                  })}
                </Select>
              </Box>
            </FormControl>
            <br />
            <FormControl variant="standard" sx={{ m: 0, minWidth: 320 }}>
              <Box
                sx={{
                  p: 1,
                  m: 1,
                }}>
                <InputLabel id="demo-simple-select-standard-label">Column mapping (to)</InputLabel>
                <Select
                  name={'gridtofldname2'}
                  style={{ "minWidth": "120px" }}
                  value={conditions.fldname2}
                  onChange={e => handleTargetColumn('fldname2', e.target.value)}>
                  <MenuItem key={'nonselected7'} name={'nonselected7'} value=''>
                    <em>None</em>
                  </MenuItem>
                  {targetTableColumns && targetTableColumns.map((value) => {
                    return (
                      <MenuItem key={value._id} value={value.shapevalue}>{value.label}</MenuItem>
                    );
                  })}
                </Select>
              </Box>
            </FormControl>
          </Box>
          :
          <Box display="flex" justifyContent="flex-start" m={1} > </Box>
        }

        <Box display="flex" flexDirection="row-reverse" p={1} >
          <Box p={1}>
            <Button
              variant="outlined"
              size="small"
              //  disabled={!conditions[0]}
              onClick={() => validateToSubmit()}
              aria-label="move selected right"
            >Validate and Close</Button></Box>
          <Box p={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => ShowEvent(0, false)}
              aria-label="move selected right"
            >Cancel</Button></Box>
        </Box>
      </Box>
      :
      <Box p={4}>
        Before configuring data cascade settings,<br /> please ensure that the form contains a minimum of two data grids. <br />
        If you have any unsaved changes, <br />
        kindly save them and try again as there are no data grids available on this form.<br />
      </Box>
  )
}


export default GridCascade
