import { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
} from '@mui/x-data-grid';

import { setApplication } from '../../redux/features/applicationSlice'
import Divider from '@mui/material/Divider';
import formApi from '../../api/formApi'
import applicationApi from '../../api/applicationApi'
import PagesHeader from '../basics/PagesHeader';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';


function randStr(len, chars = 'abcdefghklmnyszABCDEFJHKLMNYSZT0123456789') {
    let s = '';
    while (len--) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}

function EditToolbar(props) {
    const { setRows, setRowModesModel, applicationId, selectedRow, application, selectedTable } = props;
    const navigate = useNavigate();
    const [deleteTableConfirmationCounter, setDeleteTableConfirmationCounter] = useState(2);

    const handleClick = () => {
        const id = 'new' + randStr(8);
        setRows((oldRows) => [...oldRows, { _id: id, isNew: true, name: '', label: '', formDataRef: '', formSchemaRef: '', formSchemaRefID: '', homepagemenu: true, sections: [], formula: '', label: '', t1: true, t2: false, t3: false, t4: false, t5: false }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'label' },
        }));
    };

    const dropTable = async () => {
        try {
            setDeleteTableConfirmationCounter(deleteTableConfirmationCounter - 1);
            if (deleteTableConfirmationCounter < 2) {
                const res = await formApi.delete(applicationId, selectedRow.id)
                setDeleteTableConfirmationCounter(2);
                window.location.reload();
            }
        }
        catch (err) {
            console.log('err @45328 ', err)
        }
    };
    //'forms/:applicationId'
    const handleFormEdit = () => {
        // if (!rowSelectionModel[0]) {
        //     return;
        // }
        // console.log('--application---', application)
        // console.log('--selectedTable---', selectedTable)
        // console.log('--selectedForm---', selectedRow)
        navigate(`/sections/${application._id}`, { state: { appId: application._id, appName: application.name, appSiteName: application.sitename, selectedTable: { ...selectedTable }, selectedForm: { ...selectedRow.row }, stageId: 4 } });
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" variant="outlined" onClick={handleClick}>
                Add a Form
            </Button>
            <Button size="small"
                onClick={dropTable}
                disabled={selectedRow.id == undefined}
                variant="outlined"
                sx={{ ml: 1 }}
            >
                {deleteTableConfirmationCounter > 1 ? "Delete Form" : "Delete! Sure?"}
            </Button>
            <Button size="small"
                onClick={handleFormEdit}
                disabled={!selectedRow.id || selectedRow.isNew}
                variant="outlined"
                sx={{ ml: 1 }}
            >Form Designer
            </Button>

        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    setRows: PropTypes.func.isRequired,
};

export default function FormGrid() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { applicationId } = useParams()

    const application = useSelector((state) => state.application.value)
    const { appforms, apptables } = application;
    const { teams } = application;
    const [teamsLoaded, setTeamsLoaded] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedRow, setselectedRow] = useState({});
    const [rows, setRows] = useState([]);
    const [columnsDef, setColumnsDef] = useState([]);
    const [selectedTable, setSelectedTable] = useState();
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [tbls, setTbls] = useState([]);

    useEffect(() => {
        const getApplication = async () => {
            try {
                const res = await applicationApi.getOne(applicationId)
                dispatch(setApplication(res))
            } catch (err) {
                alert('@126--' + err)
            }
        }
        getApplication()
    }, [applicationId])

    useEffect(() => {
        const getApplication = async () => {
            try {
                if (teams)
                    setTeamsLoaded(true)
            } catch (err) {
                alert('@138--' + err)
            }
        }
        getApplication()
    }, [teams])


    useEffect(() => {
        if (apptables) {
            setTbls(apptables)
        }
        else {
            setTbls([])
        }

    }, [apptables]);

    useEffect(() => {
        if (appforms) {
            setRows(appforms)
            teez().then((res) => {
                setColumnsDef(res)
            })
        }
        setselectedRow({})
    }, [appforms]);

    const teez = async () => {
        const options = [];
        apptables.map((item) => {
            options.push({ value: item._id, label: item.name })
        }
        )
        return options;
    }

    const handleRowClick = (row) => {
        try {
            const appTable = apptables.find((item) => item._id == row.row.formSchemaRef)
            setSelectedTable(appTable)
            setselectedRow(row)
        }
        catch (err) {
            console.log('err @4712 ', err)
            alert('@4712--' + err)
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
    const handleSaveClick = (id, teamName) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };

    const handleCellEditStop = useCallback((params, event) => {
        event.defaultMuiPrevented = true;
    }, []);

    const handleProcessRowUpdateError = useCallback((error) => {
        setSnackbar({ children: error.message, severity: 'error' });
    }, []);


    const processRowUpdate = async (newRow) => {
        console.log('//-------newRow.isNew------', tbls);
        if (newRow.isNew) {

            if (newRow.label == '') {
                setSnackbar({ children: "No form title provided, saving a new form operation failed", severity: 'error' });
                alert("No form title provided, saving a new form operation failed");
                return newRow;
            };
            if (!newRow.formSchemaRef) {
                setSnackbar({ children: "Site table is not selected", severity: 'error' });
                alert("Site table is not selected");
                return newRow;
            };
            const appTable = apptables.find((item) => item._id == newRow.formSchemaRef)
            // console.log('----appTable---', appTable)
            let rowToInsert = { ...newRow };
            delete rowToInsert._id;
            delete rowToInsert.isNew;
            rowToInsert.formDataRef = appTable.name;
            rowToInsert.name = rowToInsert.label.replace(/ /g, "").toLowerCase();

            if (rowToInsert.name.trim() === '') {
                setSnackbar({ children: "No form name provided, saving a new form operation failed", severity: 'error' });
                return newRow;
            };
            if (rowToInsert.label.trim() === '') {
                setSnackbar({ children: "No form caption provided, saving a new form operation failed", severity: 'error' });
                return newRow;
            }
            if (rowToInsert.label.trim().length > 20) {
                setSnackbar({ children: "Maximum form name size is 20 characters", severity: 'error' });
                return newRow;
            }
            if (rowToInsert.label.trim().length < 4) {
                setSnackbar({ children: "Minimum form name size is 4 characters", severity: 'error' });
                return newRow;
            }
            if (rows.length > 26) {
                alert("Maximum number of form limit for this version has been reached")
            }
            else {
                const res = await formApi.create(applicationId, appTable._id, rowToInsert)
                dispatch(setApplication(res))
                return newRow; // return the new row containing the row id
            }

        }
        else {
            //`appforms/${applicationId}/${formId}`, body
            const res = await formApi.update(applicationId, newRow._id, newRow)
            setSnackbar({ children: ' successfully saved', severity: 'success' });
            return newRow; // return the new row containing the row id
        }
    };

    const columns = () =>
        [
            { headerName: 'Form Title', field: 'label', headerClassName: 'super-app-theme--header', width: 140, editable: true },

            {
                headerName: 'Site Table', field: 'formSchemaRef', type: 'singleSelect', headerClassName: 'super-app-theme--header', width: 140, editable: true,
                valueOptions: columnsDef
                ,

                valueGetter: ({ value, colDef }) => {
                    const option = colDef.valueOptions && colDef.valueOptions.find(
                        ({ value: optionValue }) => value === optionValue
                    );
                    // This is to solve the controlled / uncontrolled (undefined) state at render
                    if (option?.value == undefined) {
                        return ""
                    }
                    else {
                        return option.value;
                    }

                }
            },

            { headerName: 'Show on Site Menu?', field: 'homepagemenu', type: 'boolean', headerClassName: 'super-app-theme--header', width: 150, editable: true },
            { headerName: teams[0]?.teamName, field: 't1', headerClassName: 'super-app-theme--header', type: 'boolean', width: 100, editable: false },
            { headerName: teams[1]?.teamName, field: 't2', headerClassName: 'super-app-theme--header', type: 'boolean', width: 110, editable: true },
            { headerName: teams[2]?.teamName, field: 't3', headerClassName: 'super-app-theme--header', type: 'boolean', width: 110, editable: true },
            { headerName: teams[3]?.teamName, field: 't4', headerClassName: 'super-app-theme--header', type: 'boolean', width: 110, editable: true },
            { headerName: teams[4]?.teamName, field: 't5', headerClassName: 'super-app-theme--header', type: 'boolean', width: 110, editable: true },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                //width: 100,
                cellClassName: 'actions',
                getActions: ({ id }) => {
                    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                    if (isInEditMode) {
                        return [
                            <GridActionsCellItem
                                icon={<SaveIcon />}
                                label="Save"
                                onClick={handleSaveClick(id)}
                            />,
                            <GridActionsCellItem
                                icon={<CancelIcon />}
                                label="Cancel"
                                className="textPrimary"
                                onClick={handleCancelClick(id)}
                                color="inherit"
                            />,
                        ];
                    }
                    return [
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            className="textPrimary"
                            onClick={handleEditClick(id)}
                            color="inherit"
                        />
                    ];
                }
            }
        ]

    return (
        <>
            <Box>
                <Box sx={{ padding: '10px 50px' }}>
                    <PagesHeader name={application.name} sitename={application.sitename}></PagesHeader>
                    <Divider></Divider>
                    <center><h3>Dynapage Forms</h3></center>
                    {apptables && apptables.length == 0 ?
                        <center><p>No site tables found, create site tables and columns first</p></center>
                        :
                        rows && teamsLoaded && columnsDef ?
                            <Box sx={{ width: '100%' }} p={0} m={0}>
                                <DataGrid
                                    sx={{
                                        '.MuiDataGrid-cell:focus': {
                                            outline: 'none'
                                        },
                                        '& .MuiDataGrid-row:hover': {
                                            cursor: 'pointer'
                                        }
                                    }}
                                    autoHeight
                                    rows={rows}
                                    columns={columns()}
                                    getRowId={(row) => row._id}
                                    editMode="row"
                                    density="compact"
                                    onCellEditStop={handleCellEditStop}
                                    onProcessRowUpdateError={handleProcessRowUpdateError}
                                    processRowUpdate={processRowUpdate}
                                    rowModesModel={rowModesModel}
                                    onRowClick={(params, event) => handleRowClick(params, event)}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                        setRowSelectionModel(newRowSelectionModel);
                                    }}
                                    rowSelectionModel={rowSelectionModel}
                                    initialState={{
                                        pagination: { paginationModel: { pageSize: 10 } },
                                    }}
                                    slots={{
                                        toolbar: EditToolbar,
                                    }}
                                    slotProps={{
                                        toolbar: { setRows, setRowModesModel, applicationId, selectedRow, application, selectedTable },
                                    }}
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
                                )}
                            </Box>
                            :
                            <Box></Box>

                    }
                </Box>
            </Box>

        </>
    );
}



