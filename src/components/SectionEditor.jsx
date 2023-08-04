import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { Box, Typography } from '@mui/material'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import PagesHeader from '../components/basics/PagesHeader';
import DnDEditor from './DragAndDrop/DnDEditor';
import Divider from '@mui/material/Divider';

import Generator from './DragAndDrop/Generator';
import TrashCan from './DragAndDrop/TrashCan';
import columnApi from '../api/columnApi'

import { setColumns } from "../redux/features/columnsSlice"
import * as config from '../config';


const SectionEditor = ({ themeMode }) => {
  const location = useLocation();
  const [readyColumns, setReadyColmns] = useState();
  const { appId, appName, appSiteName, selectedTable, selectedForm } = location.state;
  const columns = useSelector((state) => state.columns.value);
  const dispatch = useDispatch();

  function Item(props) {
    const { sx, ...other } = props;
    return (
      <Box
        sx={{
          p: 1,
          m: 1,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
          color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: '700',
          ...sx,
        }}
        {...other}
      />
    );
  }

  useEffect(() => {
    const getColumns = async () => {
      try {
        const res = await columnApi.getAll(appId, selectedTable._id)
        dispatch(setColumns(res))
        setReadyColmns(true)
      } catch (err) {
        alert('@5632--' + err)
      }
    }
    getColumns()
  }, [])

  return (
    <>
      <Box>
        <Box sx={{ padding: '10px 50px' }}>
          <PagesHeader name={`${appName} / Site Table: ${selectedTable.name}`} sitename={appSiteName}></PagesHeader>
          <Divider />
          <center><h3>Form: {selectedForm.label}</h3></center>
          <Divider></Divider>
          <Box
            sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
          >

            <Item>
              <Accordion >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography >Containers</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Generator groupName="table" type="row" items={config.rows} />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3a-content"
                  id="panel3a-header"
                >
                  <Typography >Data field components</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Generator groupName="cell" items={columns} />
                </AccordionDetails>
              </Accordion>

              <Accordion >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography >Control components</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Generator groupName="cell" items={config.cards} />
                </AccordionDetails>
              </Accordion>
            </Item>

            <Item sx={{ flexGrow: 1 }}> {selectedForm && readyColumns ?
              <Box>
                <DnDEditor selectedForm={selectedForm} selectedApp={[]} themeMode={themeMode}></DnDEditor>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'right',
                  justifyContent: 'space-between',
                  width: '99%'
                }}>
                  <TrashCan /></Box>
              </Box>
              :
              <center><CircularProgress /></center>
            }</Item>
          </Box>
          <Box gridColumn="span 9">
            <center><a href="https://black-meadow-02cbf4e10.3.azurestaticapps.net/" target="_blank">Launch Dynapage Application</a></center>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default SectionEditor;