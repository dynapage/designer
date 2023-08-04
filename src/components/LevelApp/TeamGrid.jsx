import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
} from '@mui/x-data-grid';


import { useLocation } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import applicationApi from '../../api/applicationApi'
import { useParams, Link } from 'react-router-dom'
import { setTeamList } from '../../redux/features/teamSlice'
import UsersGrid from './UserGrid'

export default function Teams() {
    const dispatch = useDispatch();
    const location = useLocation();
    const [rowModesModel, setRowModesModel] = useState({});
    const [selecteTeam, setselectedTeam] = useState([]);
    //const { selectedApp } = location.state;
    const list = useSelector((state) => state.teams.value)
    const { applicationId } = useParams()

    useEffect(() => {
        const getTeams = async () => {
            try {
                const res = await applicationApi.getTeams(applicationId)
                dispatch(setTeamList(res))
            } catch (err) {
                alert('@2652--' + err)
            }
        }
        getTeams()
    }, [applicationId])

    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);

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


    const handleRowClickStart = (params, event) => {
        setselectedTeam(params.row)

    };

    const processRowUpdate = async (newRow) => {
        try {
            let dbTeams = [...list]
            const selectedTeam = list.findIndex(({ _id }) => _id === newRow._id);
            if (selectedTeam == 0) {
                setSnackbar({ children: "Admins team can not be modified", severity: 'error' });
            }
            else {
                if (newRow.teamName.trim().length > 16) {
                    setSnackbar({ children: "Team Name must be less than 17 chars long", severity: 'error' });
                    return newRow;
                };
                if (newRow.teamName.trim().length < 4) {
                    setSnackbar({ children: "Team Name must be more than 3 chars long", severity: 'error' });
                    return newRow;
                };
                try {
                    dbTeams[selectedTeam] = newRow;
                    const res = await applicationApi.updateTeams(applicationId, dbTeams)
                    dispatch(setTeamList(res))
                    setSnackbar({ children: "Team updated successfully", severity: 'info' });
                } catch (err) {
                    alert('@0150--' + err)
                }
            }
            return newRow;
        } catch (error) {
            setSnackbar({ children: error, severity: 'error' });
        }
    };


    const handleProcessRowUpdateError = useCallback((error) => {
        setSnackbar({ children: error.message, severity: 'error' });
    }, []);

    const columns = () => {
        return (
            [
                { headerName: 'Team name', field: 'teamName', headerClassName: 'super-app-theme--header', width: 200, editable: true },
                {
                    headerName: 'Roles', field: 'accessType', type: 'singleSelect', headerClassName: 'super-app-theme--header', width: 250, editable: true,
                    valueOptions: [
                        { value: 0, label: 'Not assigned' },
                        { value: 1, label: 'Read Only' },
                        { value: 2, label: 'Read, Edit' },
                        { value: 3, label: 'Read, Edit, Insert' },
                        { value: 4, label: '(Full) Read, Edit, Insert, Delete' },
                    ]
                    ,
                    valueGetter: ({ value, colDef }) => {
                        // console.log('//-------appadmin--', value, colDef)
                        const option = colDef.valueOptions.find(
                            ({ value: optionValue }) => value === optionValue
                        );
                        return option.value;
                    }
                },
                {
                    field: 'actions',
                    type: 'actions',
                    headerName: 'Actions',
                    //width: 100,
                    cellClassName: 'actions',
                    getActions: ({ id, teamName }) => {
                        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                        if (isInEditMode) {
                            return [
                                <GridActionsCellItem
                                    icon={<SaveIcon />}
                                    label="Save"
                                    onClick={handleSaveClick(id, teamName)}
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

            ])

    }

    return (
        <div style={{ width: '100%' }}>
            <Divider></Divider>
            <center><h3>Site Teams</h3></center>
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
                rows={list}
                columns={columns()}
                getRowId={(row) => row._id}
                editMode="row"
                density="compact"
                onRowClick={handleRowClickStart}
                onCellEditStop={handleCellEditStop}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                processRowUpdate={processRowUpdate}
                rowModesModel={rowModesModel}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
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
            <br></br>
            {selecteTeam.accessType ?
                <UsersGrid selectedteam={selecteTeam}></UsersGrid>
                :
                null}
        </div>
    );



}



