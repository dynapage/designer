import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TextBoxControl from './TextBoxControl';
import DropDownConditions from './DropDownConditions';
import SelectControlfromArray from './SelectControlfromArray';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';


const defaultProps = {
  bgcolor: 'background.paper',
  m: 1,
  border: 1,

};

const ListFromArray = (props) => {

  const { options, conditions, valueField } = props;
  const [dataFields, setdataFields] = useState(options);
  const [newdataField, setNewdataField] = useState();
  const [showConditionWindow, setConditionWindow] = useState(false);
  const [ConditionItem, setConditionItem] = useState();


  // Assign sections
  const sections = useSelector((state) => state.sections);
  const { data } = sections;


  const initialConditionValues = { showControlArea: false, showSectionArea: false, showFormArea: false, setValueArea: false, PropertyName: '', ShowControl: { show: false, controlid: 'p' }, showSection: { show: false, sectionid: '' }, SetValueControl: { setValueProperty: '', valueid: '' } }

  const [conditionproperty, setProperty] = useState(conditions);
  const [conditionindex, setIndex] = useState(-1);

  const handleTextChange = (e) => {
    setNewdataField(e.target.value)
  }

  const handleAddDataField = () => {
    dataFields.push(newdataField);
    setdataFields(dataFields);
    // setdataFields(dataFields => [...dataFields, newdataField]);
    props.controlFunc(dataFields, false, null);
  }


  const handleRemove = (item) => {
    dataFields.splice(dataFields.indexOf(item), 1);
    setdataFields(dataFields);
    props.controlFunc(dataFields, false, null);
    setNewdataField('');
  };

  function getConditionIndex(conds, propval) {
    let i = -1;
    Object.entries(conds).map(([index, val]) => {
      if (val.PropertyName === propval) {
        i = index;
      }
    })
    return i;
  };

  const selectCondition = (item) => {
    setConditionItem(item);
    setConditionWindow(true);
    let i = getConditionIndex(conditionproperty, item);


    if (i >= 0) {

      setIndex(i);
    }
    else {
      setProperty(conditionproperty => [...conditionproperty, { ...initialConditionValues, PropertyName: item }]);
      setIndex(0);

    }
  }




  const handleDropDownPropertyChange = (parentPropName, hasChild, val) => {

    let newArray = [...conditionproperty];

    if (hasChild == false) {
      newArray[conditionindex] = { ...newArray[conditionindex], [parentPropName]: val };
      setProperty(newArray);
    }
    else {

      newArray[conditionindex] = { ...newArray[conditionindex], [parentPropName]: { ...newArray[conditionindex][parentPropName], [hasChild]: val } }
      setProperty(newArray);


      // setProperty({
      //   ...conditionproperty,
      //   ShowControl: { ...conditionproperty.ShowControl, controlid: event.target.value }
      // });


    };
    //console.log('...3333333.CCCCCCC.........---', conditionproperty);
    props.controlFunc(dataFields, true, conditionproperty);

  }



  return (
    <Box display="flex" justifyContent="left">
      {dataFields ?
        <Box borderColor="primary.main" {...defaultProps} >
          <label className="form-label">{props.title ? props.title : null}</label>
          <div></div>

          <Box borderColor="primary.main" {...defaultProps} >
            <TextBoxControl name={"newDataField"} controlFunc={handleTextChange} inputType={"text"} title={"Lookup item"} controlValue={newdataField} />
            <button type="button" onClick={() => handleAddDataField()}>Add a lookup item </button>

            <List >
              {
                dataFields.map((item) => (
                  <ListItem key={item}>
                    <ListItemText
                      primary={item}
                    />
                    {/* <button type="button" onClick={() => selectCondition(item)}>View / Edit condition(s)</button> */}
                    <button type="button" onClick={() => handleRemove(item)}>Remove</button>
                  </ListItem>
                ))
              }
            </List>

          </Box>
          <SelectControlfromArray key={'cbodataFields'} name={'valuefield'} controlFunc={props.valueFieldFunc} options={dataFields} title={'Set selected value'} controlValue={valueField} />
        </Box>
        :
        null
      }
      <Box display="flex" justifyContent="left">
        {showConditionWindow ?
          <DropDownConditions key={'fc_fcond' + ConditionItem} name={ConditionItem} conditionProperty={handleDropDownPropertyChange} dataField={ConditionItem} title={'item.title'} controlValue={conditionproperty[conditionindex]} data={data} />
          :
          null
        }
      </Box>
    </Box>
  )
};

ListFromArray.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default ListFromArray;
