import React, { useState } from 'react';
import { TextField, InputLabel, MenuItem, Box, Select, NativeSelect } from '@mui/material';
//import { getData } from 'helpers/Axdata';
import columnApi from '../../../api/columnApi';
import FormControl from '@mui/material/FormControl';

const rawMatcher = [{ key: 1, value: '=', label: 'Equal', type: 4 }, { key: 2, value: '>', label: 'Greater than', type: 3 }, { key: 3, value: '>=', label: 'Greater or equal', type: 3 }, { key: 4, value: '<', label: 'Less than', type: 3 }, { key: 5, value: '<=', label: 'Less or equal', type: 3 }, { key: 6, value: '<>', label: 'not equal', type: 4 }, { key: 7, value: 'Like', label: 'Like', type: 1 }, { key: 8, value: 'Contains', label: 'Contains', type: 1 }, { key: 9, value: 'Not contain', label: 'Does not contain', type: 1 }, { key: 10, value: 'Not Empty', label: 'Not Empty', type: 1 }, { key: 20, value: 'In Table', label: 'Existis in table', type: 1 }, { key: 21, value: 'Not Table', label: 'Not Existis in table', type: 1 }];

const Where = ({ data, columns, tables, appId, controlFunc }) => {
  const [matchOperator, setmatchOperator] = useState(0);
  const [matcher, setmatcher] = useState(rawMatcher);
  const [matcherType, setmatcherType] = useState();
  const [refColumns, setrefColumns] = useState([]);

 
  const changeMatcher = (e) => {
    controlFunc({ ...data, oper: e.target.value })
  };

  const getRefColumnd = async (tblId) => {
    const res = await columnApi.getAll(
      appId,
      tblId,
    )
    setrefColumns(res.value)
  }

  const handleCol = (e) => {

    if (e.target.value != '') {

      console.log('//------------------------e.target  :', e.target.value);
      const col = columns.find((item) => item.shapevalue == e.target.value)
      let selectedValue = col.shapevalue;
      let selectedType = col.type;


      let tmpMatcher = [];
      switch (selectedType) {
        case '301':
          tmpMatcher = rawMatcher.filter(x => x.type > 0)
          setmatcherType('textbox')
          break;
        case '302':
        case '303':
        case '320':
          setmatcherType('number')
          tmpMatcher = rawMatcher.filter(x => x.type > 2)
          break;
        case '330':
          setmatcherType('checkbox')
          tmpMatcher = rawMatcher.filter(x => x.type > 3)
          break;
        case '370':
        case '380':
        case '340':
        case '341':
          setmatcherType('textbox')
          tmpMatcher = rawMatcher.filter(x => x.type === 4)
          break;
        default:
          setmatcherType('textbox')
          tmpMatcher = rawMatcher.filter(x => x.type === 4)
      }
      setmatcher([...tmpMatcher])

      controlFunc({ ...data, col: selectedValue })

    }
    else
    {
      controlFunc({ ...data, col: e.target.value })
    }

  };

  const handleVal1 = (e) => {
    console.log('//------------------handleVal1-----', e.target);
    if (matcherType === 'checkbox') {
      controlFunc({ ...data, val1: e.target.checked })
    }
    else if (matcherType === 'number') {
      controlFunc({ ...data, val1: Number(e.target.value) })
    }
    else {
      controlFunc({ ...data, val1: e.target.value })
    }

  };

  const handleValRef = (e) => {
    console.log('//------------------handleValRef-----', e.target);
    controlFunc({ ...data, val1: e.nativeEvent.target.innerText })
    getRefColumnd(e.target.value)
  };

  const handleVal2 = (e) => {
    console.log('//------------------handleVal2-----', e.target);
    controlFunc({ ...data, val2: e.target.value })
  };


  return (
  

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
          <Box
            sx={{
              p: 1,
              m: 1,
            }}>
            <InputLabel id="demo-simple-select-standard-label">Field</InputLabel>
            <Select
              sx={{ maxHeight: 60, minWidth: 150 }}
              id="Column1"
              key="Column1"
              select
              value={data.col}
              onChange={(e) => handleCol(e)}
              label="Select column"
            >
              <MenuItem key={'col1_id'} name={'colnon'} value=''>
                <em>None</em>
              </MenuItem>
              {columns.map((opt) => {
                return (
                  <MenuItem key={opt._id} value={opt.shapevalue}>
                    {opt.shapevalue}
                  </MenuItem>
                )
              }
              )}
            </Select>
          </Box>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
          <Box
            sx={{
              p: 1,
              m: 1,
            }}>
            <InputLabel id="demo-simple-select-standard-label">Condition</InputLabel>
            <Select
              sx={{ maxHeight: 60, minWidth: 150 }}
              id="txtcondition2"
              key="txtcondition2"
              label={'Operator'}
              select
              value={data.oper}
              onChange={(e) => changeMatcher(e)}>
              <MenuItem key={'col1_id'} name={'colnon'} value=''>
                <em>None</em>
              </MenuItem>
              {
                matcher.map((opt) => (
                  <MenuItem key={opt.key} value={opt.key}>
                    {opt.label}
                  </MenuItem>
                ))
              }
            </Select>
          </Box>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
          <Box
            sx={{
              p: 1,
              m: 1,
            }}>
            {data.operator > 19 ?
              <div>
                <NativeSelect
                  sx={{ maxHeight: 60, minWidth: 150 }}
                  id="tblList"
                  label={'Table'}
                  name={data.val1}
                  value={data.val1ref}
                  onChange={(e) => handleValRef(e)}>
                  {
                    tables.map((opt) => (
                      <option key={opt._id} value={opt._id} name={opt.name}>
                        {opt.name}
                      </option>
                    ))
                  }
                </NativeSelect>
                <NativeSelect
                  sx={{ maxHeight: 60, minWidth: 150 }}
                  id="tblcolumns3"
                  label={'Table column'}
                  select
                  value={data.val2}
                  onChange={handleVal2}
                >
                  {
                    refColumns.map((opt) => (
                      <option key={opt.key} value={opt.value}>
                        {opt.value}
                      </option>
                    ))
                  }
                </NativeSelect>
              </div>

              :
              <TextField sx={{ maxHeight: 60, minWidth: 150 }}
                id="txt condition4"
                type={matcherType}
                label={'Value'}
                onChange={handleVal1}
                value={data.val1}>
              </TextField>
            }
          </Box>
        </FormControl>
      </Box>


  )
}


export default Where
