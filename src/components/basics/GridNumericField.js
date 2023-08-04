import React from 'react';
import { Input, Select, InputAdornment, InputLabel, MenuItem, Box } from '@mui/material';
import ToggleButtons from './ToggleButtons';


const currencies = [
  {
    key: '£',
    value: 'GBP'

  },
  {
    key: '$',
    value: 'USD'

  },
  {
    key: '€',
    value: 'EUR'

  },
  {
    key: 'IQ',
    value: 'IQ'

  },
  {
    key: 'AE',
    value: 'AED'

  },
];

const units = [
  {
    value: 'Kg',
    key: 'Kg:',
  },
  {
    value: 'Ltr',
    key: 'Ltr:',
  },
  {
    value: 'Meter',
    key: 'Meter:',
  },
  {
    value: 'Inch',
    key: 'Inch:',
  },
  {
    value: 'Dozen',
    key: 'Dozen:',
  }
];

const controlformat = [{ key: 1, value: 'Number' }, { key: 2, value: 'Currency' }, { key: 3, value: 'Units' }];

export default function GridNumericField({ handlePropsChange, columnData }) {

 

  const handleCurrency = (e) => {
    const data = { ...columnData };
    data['fieldsymbol'] = e.target.value;
    handlePropsChange(data)

  };

  const handleFormattype = (e) => {

    handlePropsChange({ ...columnData, formattype: e })
  };


  const handleDefaultValue = (e) => {

    const data = { ...columnData };
    data['defaultvalue'] = e.target.value;
     handlePropsChange(data)
  };

  //controlFunc

  return (

    <Box display="flex" p={0}>
      <Box p={1} >
        <ToggleButtons key={'formattype' + columnData._id} orientation={"vertical"} name={'formattype'} controlFunc={handleFormattype} options={controlformat} title={'Select field format'} controlValue={columnData.formattype} />
      </Box>
      <Box p={1} >
        {columnData.formattype ?

          <Select
            style={{ "minWidth": "120px" }}
            name={'txtnumeric' + columnData._id}
            value={columnData.fieldsymbol}
            disabled={columnData.formattype === 1}
            onChange={e => handleCurrency(e)}
            className="form-select" >
            <MenuItem key={'nonselected1'} value={'non'}></MenuItem>
            {columnData.formattype === 2 ?
              currencies.map(option => {
                return (
                  <MenuItem key={option.key} value={option.key}>{option.value}</MenuItem>
                )
              })
              :
              units.map(option => {
                return (
                  <MenuItem key={option.key} value={option.key}>{option.value}</MenuItem>
                )
              })
            }
          </Select>
          :
          null
        }
      </Box>
      <Box p={1} >
        <InputLabel className="form-label">{'Default value'}</InputLabel>
        <Input
          id={'txtid' + columnData._id}
          type={'number'}
          value={columnData.defaultvalue}
          onChange={e => handleDefaultValue(e)}
          startAdornment={
            <InputAdornment position="start">
              {columnData.fieldsymbol}
            </InputAdornment>
          }
        />
      </Box>

    </Box>

  )
}

