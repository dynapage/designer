
import React, { useState, useEffect } from 'react';
import { Button, Box, } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ToggleButtons from './ToggleButtons';
import ProgressBar from './ProgressBar';
import CheckBoxControl from './CheckBoxControl';
import TextBoxControl from './TextBoxControl';
import CustomColumn from './CustomColumn/CustomColumn';


const controlformat = [{ key: 1, value: 'Sum' }, { key: 2, value: 'Average' }, { key: 3, value: 'Percentage' }];

//columns

const GridCustomField = ({ data, columnData, columns, ShowEvent, SaveEvent, withoutSave, handlePropsChange }) => {

  const [numericColumns, setnumericColumns] = useState([])
  const [colstructure, setcolstructure] = useState({
    checked: false,
    columntitle: '',
    label: '',
    tablecolumn: false,
    texttype: 1,
    columntype: 1,
    graphical: { opertype: 1, col1: '', colstatic1: false, opr1: '', col2: '', colstatic2: false, opr2: '', col3: '', showbar: false, showsum: false },
    type: 303,
    validation: false,
    shapevalue: '',
    _id: ''
  });

  useEffect(() => {

    if (columnData != undefined) {
      setcolstructure(data)
    }
    const newlist = [];
    {
      columns.map(opt => {
        // if numeric or reference lookup
        if (opt.type == 302 || opt.type == 342) {
          newlist.push(opt)
        }
      })
    }
    setnumericColumns(newlist);


  }, [columns]);

  ////console.log(colstructure, '--------GridCustomField-----------------', data);

  const handlePropertyChange = (e) => {
    setcolstructure({ ...colstructure, [e.target.name]: e.target.value })

  };

  const handleDataChange = (key, e) => {

    let cloneGraphical = { ...colstructure.graphical };
    cloneGraphical = { ...cloneGraphical, [key]: e }
    setcolstructure({ ...colstructure, graphical: cloneGraphical })

  };

  function objectId() {
    return hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
  }

  function hex(value) {
    return Math.floor(value).toString(16)
  }

  const PrepareToSave = () => {
    try {

      if (colstructure.label.trim() === '') {
        alert("Column Label cannot be empty.");
        return
      };
      if (colstructure.shapevalue.trim() === '') {
        alert("Column Name cannot be empty.");
        return
      };
      if (colstructure.graphical.col1.trim() === '') {
        alert("Column 1 cannot be empty.");
        return
      };
      if (colstructure.graphical.opr1 === '') {
        alert("Operator 1 cannot be empty.");
        return
      };
   
      let cloneGraphical = { ...colstructure };
      let gridCols = [...data.gridcols]
      cloneGraphical._id = objectId();
      gridCols.push(cloneGraphical);
      // SAVE DATA
      SaveEvent(gridCols)
      //CLOSE DAILOG 
      ShowEvent(false, 0)

    }
    catch (err) {
      console.log('err @544 :', err)
    }

  }

  return (
    <div style={{ width: '100%' }}>
      <br></br>
      <Typography variant="h6" gutterBottom>
        Virtual Numeric Column
      </Typography>
      {!columnData ?
        <Typography variant="subtitle1" gutterBottom>
          Add a numeric calculation column to this data grid
        </Typography>
        :
        <Typography variant="subtitle1" gutterBottom>
          (Read only)
        </Typography>
      }
      <Box display="flex" p={0} >
        <Box p={2} >
          <TextBoxControl name={"label"} required={true} showLabel={colstructure} controlFunc={handlePropertyChange} inputType={"text"} title={"Column Label"} controlValue={colstructure.label} />
        </Box>
        <Box p={2} >
          <TextBoxControl name={"shapevalue"} required={true} showLabel={colstructure} controlFunc={handlePropertyChange} inputType={"text"} title={"Column Name"} controlValue={colstructure.shapevalue} />
        </Box>
      </Box>


      <Box display="flex" p={0} >
        <ToggleButtons isDisabled={colstructure} size={"small"} key={'colstructure.columntype'} name={'colstructure.columntype'} controlFunc={(e) => handleDataChange('opertype', e)} options={controlformat} title={'Select field type'} controlValue={colstructure.graphical.opertype} />
      </Box>
      <CustomColumn data={colstructure.graphical} columns={numericColumns} controlFunc={handleDataChange}></CustomColumn>



      {/* <Box display="flex" p={2} >
          <Box p={0}>
            <CheckBoxControl key={'cbprogress'} name={'showasprogress'} controlFunc={(e) => handleDataChange('showbar', e.target.checked)} inputType={'checkbox'} title={'Display percentage with visualisation'} controlValue={colstructure.graphical.showbar} />
          </Box>
          <Box p={1} alignSelf="flex-end">
            <ProgressBar progress={340}></ProgressBar>
          </Box></Box> */}

      {/* <Box display="flex" p={2} >
        <Box p={0}>
          <CheckBoxControl isDisabled={tr} key={'cbshowsum'} name={'showsum'} controlFunc={(e) => handleDataChange('showsum', e.target.checked)} inputType={'checkbox'} title={'Show sum total for all rows'} controlValue={colstructure.graphical?.showsum} />
        </Box>
      </Box> */}

      {!withoutSave ?
        <Box display="flex" flexDirection="row-reverse" p={1} >
          <Box p={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={PrepareToSave}
              aria-label="move selected right"
            >Validate and Close</Button></Box>
          <Box p={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => ShowEvent(false, 0)}
              aria-label="move selected right"
            >Cancel</Button></Box>
        </Box>
        :
        null
      }
    </div>
  )
}


export default GridCustomField
