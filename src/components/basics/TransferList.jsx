import React, { useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from "@mui/material/Typography";
import { Box } from '@mui/material';
import GridColumnProperties from './GridColumnProperties';
import { uid } from '../../redux/helpers/index';
//GridColumnProperties



function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}


const TransferList = ({ tableCols, tableId, columns, customcolumns, handlePropertiesChange }) => {



  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [showProperty, setshowProperty] = useState(false);

  const [checked, setChecked] = useState([]);
  const [checkedColumn, setCheckedColumn] = useState();
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);


  useEffect(() => {

    if (columns) {
      setLeft(columns)
      let potentailColumns = [...columns]

      if (tableCols.datarefid === tableId) {

        tableCols.gridcols.map((item) => {

          const colIndex = potentailColumns.findIndex((col) => col.shapevalue === item.shapevalue);
          potentailColumns.splice(colIndex, 1)
        }
        )
        setLeft(potentailColumns)
        setRight(tableCols.gridcols);
        if (customcolumns && !!customcolumns) {
          let clonecols = [...columns]

          clonecols.push(customcolumns)
          setLeft(clonecols)
        }
      }
      else {
        setRight([])
      }
    }


  }, [columns]);

  useEffect(() => {
    if (!!right.length) {
      handlePropertiesChange(right);
    }
  }, [right]);

  const handlePropsChange = (returnedValue) => {

    let index = 0;
    if (returnedValue._id == undefined) {
      index = right.findIndex(x => x.uuid === returnedValue.uuid)
    }
    else {
      index = right.findIndex(x => x._id === returnedValue._id)

    }


    //undefined
    if (index >= 0) {
      let newright = [...right]
      newright[index] = returnedValue;

      setRight(newright);

      handlePropertiesChange(newright);
    }
  };

  const handleToggle = (value, title) => {
    setshowProperty(false);
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    if (title === 'Chosen Columns') {
      setChecked([value]);
      setCheckedColumn(value);
      setshowProperty(true);
    }
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleCheckedRight = () => {

    if (left) {
      var customCol = [];
      leftChecked.forEach((index) => {
        var tempCol = { ...index };
        tempCol.datarefid = index._id;
        tempCol.uuid = uid('rgh_');
        delete tempCol._id;
        customCol.push(tempCol);
      });
      setRight(right.concat(customCol));
      setLeft(not(left, leftChecked));
      setChecked(not(checked, leftChecked));
    };
  };
  //
  const handleCheckedLeft = () => {
    console.log('---------------handleCheckedLeft           :', left)
    if (left) {
      setLeft(left.concat(rightChecked));
      setRight(not(right, rightChecked));
      setChecked(not(checked, rightChecked));
    };
  };



  const customList = (title, items) => (
    items && items.length ?
      <Card style={{ maxHeight: '330px', overflow: 'auto' }}>
        {/* <CardHeader subheader={`${numberOfChecked(items)}/${items.length} selected`} /> */}
        <CardHeader subheader={'Table columns'} />
        <Divider />
        <List dense component="div" role="list">
          {
            Object.entries(items).map(([key, value]) => {
              return (
                <ListItem key={key} role="listitem" onClick={e => handleToggle(value, title)}>
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': value.shapevalue }}
                    />
                  </ListItemIcon>
                  <ListItemText id={value.shapevalue} primary={value.label} />
                </ListItem>
              );
            })}
          <ListItem />
        </List>
      </Card>
      : <Card style={{ maxHeight: '330px', overflow: 'auto' }}>
        {/* <CardHeader subheader={`${numberOfChecked(items)}/${items.length} selected`} /> */}
        <CardHeader subheader={'Table columns'} />
        <Divider /></Card>
  );

  const customListRight = (title, items) => (
    items ?
      <Card style={{ maxHeight: '330px', overflow: 'auto' }}>
        <CardHeader subheader={'Grid columns'} />
        <Divider />
        <Box p={1}>
          <RadioGroup key={'rightsection'} aria-label="rightsection" name="rightsection" onChange={e => { handleToggle(items[e.target.value], title) }}>
            {
              Object.entries(items).map(([key, value]) => {
                return (
                  <FormControlLabel key={key} value={value.shapevalue} control={<Radio value={key} />} label={value.label} />
                );
              })}
            <ListItem />
          </RadioGroup></Box>
      </Card>
      : <Card style={{ maxHeight: '330px', overflow: 'auto' }}>
        <CardHeader subheader={'Grid columns'} />
        <Divider /></Card>
  );



  return (
    <Box p={1} >
      <center><Typography>
        Allocate or deallocate table columns (left) to Data grid (right)
      </Typography></center>
      <Grid container sx={{ minWidth: 650, overflow: 'auto', justifyContent: 'center' }} justify="left" alignItems="top" >
        <Grid item xs={5}>{customList('Available Columns', left)}</Grid>
        <Grid item>
          <Grid item xs={2} container direction="column" alignItems="center">
            <Box p={1}><Button
              variant="outlined"
              size="small"
              onClick={() => handleCheckedRight()}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button></Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleCheckedLeft()}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={5}>{customListRight('Chosen Columns', right)}</Grid>
      </Grid ><p></p><Divider></Divider>

      {

        Object.entries(right).map(([key, value]) => {

          return (
            <div><u>{value.label}</u><GridColumnProperties handlePropsChange={handlePropsChange} columnData={value} columns={left} showProperty={true} /><Divider></Divider></div>
          )
        })}

    </Box>
  );
}



export default TransferList
