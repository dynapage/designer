import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import getNode from './getNode';
import DnDTable from './DnDTable';
import CheckBoxControl from '../basics/CheckBoxControl';
import { treeToJSON, getByPath } from '../../redux/helpers/index';
import { useParams } from 'react-router-dom'
import formApi from '../../api/formApi'
import Divider from '@mui/material/Divider';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
//import { getSections } from '../../redux/features/sectionsSlice'
import { addNode, removeNode, moveNode, saveSections, fetchSections } from '../../redux/actions/sections';
import applicationApi from '../../api/applicationApi'
import { setApplication } from '../../redux/features/applicationSlice'
import { PropertyForm } from '../basics/PropertyForm';
import FormulaField from '../basics/CustomColumn/FormulaField';


export const DnDEditor = ({ selectedForm, themeMode }) => {
  const dispatch = useDispatch();
  // Fetch Form sections data
  const selectedApp = useSelector((state) => (state.application.value));
  const { applicationId } = useParams()
  const formId = selectedForm._id;

  const [defaultForm, setAsDefaultForm] = useState(selectedForm.name == selectedApp.startformname);
  const [childNewAppDrawer, setOpenNewAppDrawer] = useState(false);
  const [childFormulaDrawer, setChildFormulaDrawer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [showUserData, setShowUserData] = useState(selectedForm.showuserdata);
  const [showTeamData, setShowTeamData] = useState(selectedForm.showteamdata);
  const [resReady, setResReady] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const sections = useSelector((state) => state.sections);
  const { data } = sections;

  const handleCloseSnackbar = () => setSnackbar(null);

  useEffect(() => {
    const getSections = async () => {
      //try {
      if (selectedApp._id != applicationId) {
        const res = await applicationApi.getOne(applicationId)
        dispatch(setApplication(res))
      }

      dispatch(fetchSections(applicationId, formId)).then(response => {
        setResReady(true);
      })
    }

    getSections()
  }, [])

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleSave = async () => {
    try {
      dispatch(saveSections(applicationId, formId, treeToJSON(data)));
      setSnackbar({ children: "Changes saved successfully", severity: 'success' });
    }
    catch (err) {
      setSnackbar({ children: err, severity: 'error' });
    }

  };
  const handleNodeChange = async ({ addedIndex, removedIndex, payload }, path) => {
    try {
      if (addedIndex !== null && removedIndex !== null) {
        dispatch(moveNode(path, removedIndex, addedIndex));
      }
      else if (removedIndex !== null) {
        //console.log(path, '=====22222222222=======payload===', addedIndex, '=====2222222222222222222222222222222=============array:', payload)
        dispatch(removeNode(path, removedIndex));
      }
      else if (addedIndex !== null) {
        // console.log(path, '=====333333333333333333=======pvvayload===', addedIndex, '====3333333333333333333333333============array:', payload)
        dispatch(addNode(path, addedIndex, getNode(payload)));
      }
    }
    catch (err) {
      console.log('err @ 5688 ', err)
    }
  };

  const handleDefaultFormChange = (e) => {
    let appData = { ...selectedApp }
    if (e.target.checked) {
      appData.startformname = selectedForm.name;
      appData.startformid = formId;
      applicationApi.update(applicationId, appData)
      //  dispatch(saveAppChanges(applicationId, appData));
      setAsDefaultForm(true);
    }
  };

  const handleTeamRecords = (e) => {
    let frmData = { ...selectedForm }
    if (e.target.checked) {
      setShowUserData(true)
    }
    else {
      setShowUserData(false)
    }
  };

  const handleUserRecords = (e) => {
    if (e.target.checked) {
      setShowTeamData(true)
    }
    else {
      setShowTeamData(false)
    }
  };

  const handleSaveSettings = (e) => {
    let frmData = { ...selectedForm }
    frmData.showuserdata = showUserData;
    frmData.showteamdata = showTeamData;
    formApi.update(applicationId, formId, frmData)

    //  dispatch(updateForm(frmData, selectedApp._id, frmData._id))
    setShowSettings(false);
  };

  const handleCancelettings = (e) => {
    setShowSettings(false);
  };

  const [state, setDialogValues] = useState(
    {
      activeShapePath: '', dialogValues: {}, controlType: 0
    }
  );

  const [selectedValue, setSelectedValue] = useState({});

  const handleDialogOpen = (path) => {
    setDialogValues({ ...state, activeShapePath: path, dialogValues: getByPath(data, path), controlType: getByPath(data, path).type });
    setOpenNewAppDrawer(true);
  }

  const handleFormulaDialogOpen = (path) => {

    setChildFormulaDrawer(true);
  }

  const handleFormulaChange = (e) => {
    console.log('e-----------------data-----------------  ', selectedForm)
   
    // setControlData({ ...controlData, formula: e });

    let frmData = { ...selectedForm }
    frmData.formula = e;
    console.log('e-----------------frmData----------------  ', applicationId, formId, frmData)
    formApi.update(applicationId, formId, frmData)

  }

  return (
    <div style={{ width: '100%' }}>
      <Box display="flex"  >

        <Box
          sx={{
            p: 1,
            m: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.200'),
            color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',

          }}>
          <Button variant="outlined" disabled={showSettings} onClick={handleShowSettings} startIcon={<SettingsOutlinedIcon />}>
            Form settings
          </Button>


        </Box>
        <Box p={1} flexGrow={1} >
        </Box>
        <Box
          sx={{
            p: 1,
            m: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.200'),
            color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',

          }}>
          <Button variant="outlined"
            disabled={showSettings}
            onClick={handleSave} startIcon={<SaveOutlinedIcon />}
          >Save ALL Form Changes</Button>
        </Box>
      </Box>
      {showSettings ?
        <Box p={1} flexGrow={0} >
          <CheckBoxControl key={'cbstartformname'} keyprop={'cbstartformname'} name={'startformname'} controlFunc={handleDefaultFormChange} title={'Set this form as a default startup Site Form'} controlValue={defaultForm} />
          <CheckBoxControl key={'chkshowteamData'} keyprop={'chkshowteamData'} name={'chkshowteamData'} controlFunc={handleUserRecords} title={'Show Logged on User records only (User level), default is (Team level)'} controlValue={showTeamData} />
          {childFormulaDrawer ?
            <FormulaField controlFunc={handleFormulaChange} selectedForm={ selectedForm } setFormulaDrawer={setChildFormulaDrawer} formulaDrawer={childFormulaDrawer}></FormulaField>
            :
            null
          }
          <Divider></Divider>
          <Box p={1} flexGrow={1} sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '99%'
          }}>
            <Box sx={{
              display: 'flex',
            }}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={handleFormulaDialogOpen}
              >Formula</Button>
            </Box>

            <Box sx={{
              display: 'flex',
            }}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={handleCancelettings}
              >Cancel</Button>
            </Box>
            <Box sx={{
              display: 'flex',
            }}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={handleSaveSettings}
              >Save Settings</Button>
            </Box>
          </Box>
        </Box>
        :
        null}
      {
        resReady ?
          <Box>
            <DnDTable
              data={data}
              onChange={handleNodeChange}
              onPropertiesOpen={handleDialogOpen}
              themeMode={themeMode}
            />
            {!!snackbar && (
              <Snackbar
                open
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}
              >
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
              </Snackbar>
            )}</Box>
          :
          <center><CircularProgress /></center>
      }
      {
        childNewAppDrawer ?
          <PropertyForm initialState={childNewAppDrawer} selectedValue={selectedValue} closeOpenFlag={setOpenNewAppDrawer} activeShapePath={state.activeShapePath} data={state.dialogValues} selectedFormId={formId} selectedApp={selectedApp} />
          :
          null
      }
    </div >
  )
};


export default DnDEditor 