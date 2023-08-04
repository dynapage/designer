import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { InputLabel, Select, MenuItem, Box } from '@mui/material';
//import { fetchLookUpTableColumns } from 'redux/actions/columns';
import columnApi from '../../api/columnApi';

export default function SelectTableColumns(props) {




  const dispatch = useDispatch();
  const [columns, setcolumns] = React.useState();

  const fetchData = React.useCallback(async () => {

    columnApi.getAll(props.selectedApp._id, props.dataField).then((res) =>
    {
      setcolumns(res);
    }
    )
    
  }, [])




  // the useEffect is only there to call `fetchData` at the right time
  useEffect(() => {
    fetchData()
      // make sure to catch any error
      .catch(console.error);;
  }, [fetchData]);

  //console.log('//---------------------_______________-------------------_______________', props.controlType , columns)
  // if not data grid
  if (props.controlType != 50) {
    return (
      <Box component="span" display="block" my={2} whiteSpace="nowrap">
        <InputLabel key={'stcinplabel'} className="form-label">{props.title ? props.title : null}</InputLabel>

        {columns ?
          <Select
            labelId="data-type-label"
            id={props.name + props.dataField}
            key={props.name + props.dataField}
            name={props.name ? props.name : null}
            value={props.controlValue}
            onChange={props.controlFunc}
           
          >
           
            {columns.map((opt) => {
              //console.log('==:::', props.controlValue, '  (____________------------opt--------_______________', opt.shapevalue)
              if (opt.shapevalue != props.controlValue)
              {
                return (
                  <MenuItem 
                    key={opt._id}
                    value={opt.shapevalue}>{opt.label}</MenuItem>
                )
              }
              else if (props.controlType == 341)
              {
                return (
                  <MenuItem 
                    key={opt._id}
                    value={opt.shapevalue}>{opt.label}</MenuItem>
                )
              }
                
            }

            )}
          </Select>
          :
          null
        }
      </Box>
    )
  }
  else {
    return (
      null
    )
  }
};

SelectTableColumns.propTypes = {
  name: PropTypes.string.isRequired,
  selectedOption: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};


