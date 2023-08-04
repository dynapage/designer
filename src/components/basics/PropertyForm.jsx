import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';


import * as config from '../../config';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextBoxControl from './TextBoxControl';
import ColorControl from './ColorControl';
import CheckBoxControl from './CheckBoxControl';
import SelectControlfromArray from './SelectControlfromArray';
import ToggleButtons from './ToggleButtons';
import SelectDataFieldControl from './SelectDataFieldControl';
import URLControl from './URLControl';
import ListFromArray from './ListFromArray';
import GridSimple from './GridSimple';
import SelectTableColumns from './SelectTableColumns';
import SelectTextTypeControl from './SelectTextTypeControl';
import { editProperties } from '../../redux/actions/sections';
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import FormulaField from './CustomColumn/FormulaField';

export const PropertyForm = (props) => {
  const { data, activeShapePath, closeOpenFlag, initialState, selectedFormId, selectedApp } = props;
  const propcontrols = config.controlproperties;
  const dispatch = useDispatch();
  const apptables = useSelector((state) => (state.application.value || []).apptables);
  const [controlData, setControlData] = useState({ ...data });
  const [state, setState] = React.useState(false);
  const [isSubGridFunction, setIsSubGridFunction] = React.useState(false);

  console.log('//---data---PropertyForm----------------------------------', data)

  React.useEffect(() => {
    setState(initialState);
  }, [initialState]);

  const handleSubmit = async () => {
    await updateProperties();
    closeOpenFlag(false);
  }

  const updateProperties = async () => {
    dispatch(editProperties(activeShapePath, controlData));
  }

  const handleTextChange = (e) => {
    setControlData({ ...controlData, [e.target.name]: e.target.value });
  };

  const handleURLChange = (e) => {
    setControlData({ ...controlData, redirectto: e.target.value });
  }



  const handleCheckedChange = (e) => {
    setControlData({ ...controlData, checktype: e })
  }

  const handleDataFieldChange = (e, hasCondition, conditionData) => {
    setControlData({ ...controlData, datafield: e })
    if (hasCondition) setControlData({ ...controlData, fieldcondition: conditionData });
  }

  const handlePropChange = (e, keyTpUpdate) => {
    
    controlData[keyTpUpdate] = e;
    updateProperties();
  }

  const handleCheckboxChange = (e) => {
    setControlData({ ...controlData, [e.target.name]: e.target.checked })
  }

  const toggleDrawer = (event) => {
    if (event) closeOpenFlag(false);
  };

  return (
    <Drawer
      anchor={'right'}
      open={state}
      onClose={(event) => toggleDrawer(event)}
    >
      {apptables ?
        <Box sx={{
          justifyContent: 'space-between',
          p: 2,
          minWidth: 450
        }}><br /><br /><br />
          {
            Object.entries(controlData).map(([key, value]) => {

              return (
                propcontrols.map((item, index) => {

                  if (String(key).valueOf() === String(item.name).valueOf()) {

                    switch (item.inputType) {
                      case "text":
                        return (
                          <div><TextBoxControl key={'txt' + index} name={item.name} controlFunc={handleTextChange} inputType={item.inputType} title={item.title} controlValue={value} /><Divider></Divider></div>
                        );
                        break;
                      case "color":
                        return (
                          <div><ColorControl key={'lbl' + index} name={item.name} controlFunc={handleTextChange} inputType={item.inputType} title={item.title} controlValue={value} /> <Divider></Divider></div>
                        );
                        break;
                      case "checkbox":
                        return (
                          <div><CheckBoxControl key={'cb' + index} itemType={controlData.type} keyprop={'cb' + index} name={item.name} controlFunc={handleCheckboxChange} title={item.title} controlValue={value} /><Divider></Divider></div>
                        );
                        break;
                      case "datarefid":
                        // controlValue
                        return (
                          <div>{value ? <SelectTableColumns key={'fsh' + index} name={"valuefield"} controlType={controlData.type} controlFunc={handleTextChange} selectedApp={selectedApp} dataField={value} title={item.title} controlValue={controlData.valuefield} /> : null}<Divider></Divider></div>
                        );
                        break;
                      case "select":

                        return (
                          <div><SelectControlfromArray key={'sa' + index} name={item.name} controlFunc={handleTextChange} options={item.options} title={item.title} controlValue={value} /><Divider></Divider></div>
                        );
                        break;
                      case "texttype":
                        if (data.type == 301) {
                          return (
                            <div><SelectTextTypeControl key={'satt' + index} name={item.name} controlFunc={handleTextChange} options={item.options} title={item.title} controlValue={value} /><Divider></Divider></div>
                          );
                        }

                        break;
                      case "columnselect":
                        if (item.type == 341 || item.type == 40)
                          return (
                            <div><ListFromArray key={'la' + index} name={item.name} valueFieldFunc={handleTextChange} valueField={controlData.valuefield} controlFunc={handleDataFieldChange} options={controlData.datafield} dataField={controlData.label} title={item.title} controlValue={value} conditions={controlData.fieldcondition} /><Divider></Divider></div>
                          );
                        break;
                      case "checked":
                        return (
                          <div>{value ? <ToggleButtons key={'tbtn' + index} name={item.name} controlFunc={handleCheckedChange} options={controlData.checktype} title={item.title} controlValue={controlData.checktype} /> : null}<Divider></Divider></div>
                        );
                        break;
                     
                      //graphical
                      case "datarefobject":
                        return (
                          <div>{value ? <SelectDataFieldControl key={index} name={item.name} controlType={controlData.type} controlFunc={handleTextChange} options={apptables} dataField={controlData.label} controlColumn={false} title={item.title} controlValue={value} /> : null}<Divider></Divider></div>
                        );
                        break;
                      case "grid":
                        return (
                          <div><GridSimple setSubGridFunction={setIsSubGridFunction} key={'gr' + index} name={item.name} handlePropChange={handlePropChange} controlProperties={controlData} originalTblId={controlData.datarefid} title={item.title} controlValue={value} selectedApp={selectedApp} formId={selectedFormId} /><Divider></Divider></div>
                        );
                        break;
                      case "valuefield":
                        switch (controlData.type) {
                          case 3:
                            // URL
                            return (
                              <div><URLControl key={'url' + index} name={item.name} controlFunc={handleURLChange} inputType={item.inputType} title={item.title} controlValue={value} selectedApp={selectedApp} /><Divider></Divider></div>
                            );
                            break;
                          default: null
                        }

                    }
                  }
                })
              )
            })
          }

        </Box>

        :
        <center><div width="90%">Session expired, please reselect the <br /> form from (Data Tables and Forms) section</div></center>
      }

      <Button disabled={isSubGridFunction} onClick={() => handleSubmit()} color="primary">
        Apply Changes
      </Button><br />
    </Drawer>

  )
};



