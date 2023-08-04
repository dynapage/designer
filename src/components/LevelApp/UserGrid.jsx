import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
} from '@mui/x-data-grid';

import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import applicationApi from '../../api/applicationApi'
import { setApplication } from '../../redux/features/applicationSlice'

function randStr(len, chars = 'abcdefghklmnysABCDEFJHKLMNYT0123456789') {
    let s = '';
    while (len--) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}


function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randStr(14);
        setRows((oldRows) => [...oldRows, { _id: id, username: '', userId: '', userpwd: randStr(12), isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'username' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add user
            </Button>
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    setRows: PropTypes.func.isRequired,
};

export default function UsersGrid({ selectedteam }) {
    const dispatch = useDispatch();

    const [snackbar, setSnackbar] = React.useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);


    const selectedApp = useSelector((state) => (state.application.value));
    //** varyo because I am pissed off with this work */
    const varyo = useSelector((state) => (state.application.value ? state.application.value.teams.find(({ _id }) => _id === selectedteam._id) : selectedteam));
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [rows, setRows] = React.useState([]);
    const [hidepass, setHidePass] = React.useState({ show: false, val: null });




    useEffect(() => {
        if (varyo) {
            setRows(varyo.users)
        }
        else {
            setRows(selectedteam)
        }

    }, [varyo]);


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

    const handleCellEditStop = React.useCallback((params, event) => {
        event.defaultMuiPrevented = true;
    }, []);

    const handleProcessRowUpdateError = React.useCallback((error) => {
        setSnackbar({ children: error.message, severity: 'error' });
    }, []);

    const processRowUpdate = async (newRow) => {

        let dbApp = { ...selectedApp }
        const selectedItem = dbApp.teams.findIndex(({ _id }) => _id === selectedteam._id);
        try {

            if (newRow.userId.trim() === '') {
                setSnackbar({ children: "User email cannot be empty", severity: 'error' });
                return newRow;
            };
            if (newRow.userId.trim().length < 7) {
                setSnackbar({ children: "User email must be more than 6 chars long", severity: 'error' });
                return newRow;
            };
            if (newRow.userId.trim().length > 38) {
                setSnackbar({ children: "User email must be less than 38 chars long", severity: 'error' });
                return newRow;
            };

            if (newRow.username.trim() === '') {
                setSnackbar({ children: "User name cannot be empty", severity: 'error' });
                return newRow;
            };

            if (newRow.username.trim().length < 7) {
                setSnackbar({ children: "User name must be more than 6 chars long", severity: 'error' });
                return newRow;
            };
            if (newRow.username.trim().length > 38) {
                setSnackbar({ children: "User name must be less than 38 chars long", severity: 'error' });
                return newRow;
            };

            if (newRow.userpwd.trim() === '') {
                setSnackbar({ children: "User pssword cannot be empty", severity: 'error' });
                return newRow;
            };

            if (newRow.userpwd.trim().length < 8) {
                setSnackbar({ children: "User pssword must be between 8 to 14 chars long", severity: 'error' });
                return newRow;
            };
            if (newRow.userpwd.trim().length > 14) {
                setSnackbar({ children: "User pssword must be between 8 to 14 chars long", severity: 'error' });
                return newRow;
            };

            if (newRow.isNew) {
                let rowToInsert = { ...newRow };
                delete rowToInsert._id;
                delete rowToInsert.isNew;
                const res = await applicationApi.createUser(selectedApp._id, selectedteam._id, rowToInsert);
                dispatch(setApplication(res))
                setSnackbar({ children: "Team user created successfully", severity: 'info' });
                return newRow;
            }
            else {
                let existingUsers = [...dbApp.teams[selectedItem].users];
                // const promptedItem = existingUsers.find((item) => item._id === newRow._id);
                let userId = newRow._id;
                const res = await applicationApi.updateUser(selectedApp._id, selectedteam._id, userId, newRow);
                dispatch(setApplication(res))
                setSnackbar({ children: "Team user updated successfully", severity: 'info' });
                return newRow;
                //userId  username  userpwd
            }

        }
        catch (err) {
            console.log('error @14401: ', err);
        }
    };

    const handleDeleteClick = (id) => async () => {
        if (confirm("Are you sure you want to delete this user?") == true) {
            const res = await applicationApi.deleteUser(selectedApp._id, selectedteam._id, id);
            dispatch(setApplication(res))
        }
    };

    const columns = () => {
        return (
            [
                { headerName: 'User name', field: 'username', headerClassName: 'super-app-theme--header', width: 200, editable: true },
                { headerName: 'User email', field: 'userId', headerClassName: 'super-app-theme--header', width: 200, editable: true },
                {
                    headerName: 'User password', field: 'userpwd', headerClassName: 'super-app-theme--header', width: 200, editable: true,
                    renderCell: ({ value, index }) => {
                        return (
                            <Button
                                sx={{ textTransform: 'none' }}
                                size="small"
                                onClick={() => setHidePass({ show: !hidepass, val: value })}
                                aria-label="Shw password"
                            >{!hidepass.show && hidepass.val != value ? 'Show password' : value}</Button>
                        );
                    }
                },
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
                            ,
                            <GridActionsCellItem
                                icon={<DeleteIcon />}
                                label={"Delete"}
                                onClick={handleDeleteClick(id)}
                                color="inherit"
                            />,
                        ];
                    }

                }

            ])

    }

    return (
        <div style={{ width: '100%' }}>
            <Divider></Divider>
            <center><h3>{selectedteam.teamName} team users</h3></center>
            {rows ?
                <Box>
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
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        slots={{
                            toolbar: EditToolbar,
                        }}
                        slotProps={{
                            toolbar: { setRows, setRowModesModel },
                        }}
                    />{!!snackbar && (
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
                null
            }
        </div>
    );



}



