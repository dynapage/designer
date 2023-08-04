import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DataGrid, GridCellModes } from '@mui/x-data-grid';
import ColumnForm from './ColumnForm';
//import { deleteColumn, checkColumnName } from 'redux/actions/columns';
import columnApi from '../../api/columnApi'
import { useDispatch } from 'react-redux';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';


function EditToolbar(props) {
    const dispatch = useDispatch();
    const { setTableColumns, selectedCellParams, cellMode, cellModesModel, setCellModesModel, setIsEdit, setOpenNewAppDrawer, selectedApp, selectedTable, selectedRow, setShowExistField } = props;

    const [deleteTableConfirmationCounter, setDeleteTableConfirmationCounter] = React.useState(2);

    const handleSaveOrEdit = () => {
        if (!selectedCellParams) {
            return;
        }
        const { id, field } = selectedCellParams;
        if (cellMode === 'edit') {
            setCellModesModel({
                ...cellModesModel,
                [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.View } },
            });

        } else {
            setOpenNewAppDrawer(true);
            setIsEdit(true);
            // setCellModesModel({
            //     ...cellModesModel,
            //     [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.Edit } },
            // });
        }
    };

    const handleCancel = () => {
        if (!selectedCellParams) {
            return;
        }
        const { id, field } = selectedCellParams;
        setCellModesModel({
            ...cellModesModel,
            [id]: {
                ...cellModesModel[id],
                [field]: { mode: GridCellModes.View, ignoreModifications: true },
            },
        });
    };

    const handleNewColumn = () => {
        setIsEdit(false);
        setOpenNewAppDrawer(true);

    };


    const dropColumn = async () => {
        try
        {
        if (!selectedCellParams) {
            return;
        }
        setDeleteTableConfirmationCounter(deleteTableConfirmationCounter - 1);
        if (deleteTableConfirmationCounter < 2) {
            const status = await columnApi.checkColumnName(selectedApp._id, selectedRow.shapevalue)
            console.log('delete shapevalue  --', status.status)
            //const { status } = await dispatch(checkColumnName(selectedApp._id, selectedRow.shapevalue));
            if (status.status == false) {
               const res = await columnApi.delete(selectedApp._id,  selectedTable._id, selectedRow._id)
                setTableColumns(res)
            }
            else
            {
                setShowExistField(status);
            }
            setDeleteTableConfirmationCounter(2);
        }
        
    }
    catch(err)
    {
        setDeleteTableConfirmationCounter(2);
        console.log('err @4345 ', err)
    }
    };

    const handleMouseDown = (event) => {
        // Keep the focus in the cell
        event.preventDefault();
    };

    return (
        <Box
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                p: 1,
            }}
        > <Stack direction="row" spacing={1}>

                {/* <Button size="small"
                    // onClick={handleCancel}
                    // onMouseDown={handleMouseDown}
                    disabled={!selectedCellParams}
                    variant="outlined"
                    sx={{ ml: 1 }}
                >
                    Table Columns
                </Button> */}
                <Button size="small"
                    onClick={handleSaveOrEdit}
                    onMouseDown={handleMouseDown}

                    disabled={!selectedCellParams}
                    variant="outlined"
                    sx={{ ml: 1 }}
                >
                    {cellMode === 'edit' ? 'Save' : 'Edit'}
                </Button>
                <Button size="small"
                    onClick={dropColumn}
                    // onMouseDown={handleMouseDown}
                    disabled={!selectedCellParams}
                    variant="outlined"
                    sx={{ ml: 1 }}
                >
                    {deleteTableConfirmationCounter > 1 ? "Delete Column" : "Delete! Sure?"}
                </Button>
                <Button size="small"
                    onClick={handleCancel}
                    onMouseDown={handleMouseDown}
                    disabled={cellMode === 'view'}
                    variant="outlined"
                    sx={{ ml: 1 }}
                >
                    Cancel
                </Button>
                <Button size="small" onClick={handleNewColumn} variant="outlined" sx={{ ml: 1 }}>
                    Add a column
                </Button>
            </Stack>

        </Box>
    );
}

EditToolbar.propTypes = {
    openNewAppDrawer: PropTypes.oneOf(['edit', 'view']),
    cellModesModel: PropTypes.object.isRequired,
    selectedCellParams: PropTypes.shape({
        field: PropTypes.string.isRequired,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }),
    setCellModesModel: PropTypes.func.isRequired,
    setOpenNewAppDrawer: PropTypes.func.isRequired,
    setShowExistField: PropTypes.func.isRequired,
    selectedRow: PropTypes.shape({}),


};

export default function ColumnGrid({ initialState, selectedApp, selectedTable, closeOpenFlag }) {

    const [selectedCellParams, setSelectedCellParams] = React.useState(null);
    const [cellModesModel, setCellModesModel] = React.useState({});
    const [openNewAppDrawer, setOpenNewAppDrawer] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [selectedRow, setselectedRow] = React.useState({});
    const [showExistField, setShowExistField] = React.useState(false);
    const [state, setState] = React.useState(true);
    const [tableColumns, setTableColumns] = React.useState(selectedTable.columns);

    const toggleDrawer = (event) => {
        if (event) closeOpenFlag(false);
    };


    React.useEffect(() => {
        setState(initialState);
    }, [initialState]);

    const handleCellFocus = React.useCallback((event) => {
        const row = event.currentTarget.parentElement;
        const id = row.dataset.id;
        const field = event.currentTarget.dataset.field;
        setSelectedCellParams({ id, field });
    }, []);

    const cellMode = React.useMemo(() => {
        if (!selectedCellParams) {
            return 'view';
        }
        const { id, field } = selectedCellParams;
        return cellModesModel[id]?.[field]?.mode || 'view';

    }, [cellModesModel, selectedCellParams, openNewAppDrawer]);

    const handleCellKeyDown = React.useCallback(
        (params, event) => {
            if (cellMode === 'edit') {
                // Prevents calling event.preventDefault() if Tab is pressed on a cell in edit mode
                event.defaultMuiPrevented = true;
            }
        },
        [cellMode],
    );

    return (
        <Drawer
            anchor={'right'}
            fullScreen
            open={state}
            onClose={(event) => toggleDrawer(event)}

        >
            <Box sx={{
                justifyContent: 'space-between',
                p: 2,
                minWidth: 460
            }}><br /><br /><br />

                {showExistField ? <Box sx={{ color: 'red', backgroundColor: 'white', }}>
                    <h4 >Field: {selectedRow.shapevalue} already used in a form, can not be deleted</h4></Box> : null}

                <center><h3>Table Columns</h3></center>
                <DataGrid
                    sx={{
                        // disable cell selection style
                        '.MuiDataGrid-cell:focus': {
                            outline: 'none'
                        },
                        // pointer cursor on ALL rows
                        '& .MuiDataGrid-row:hover': {
                            cursor: 'pointer'
                        }
                    }}
                    rows={tableColumns}
                    columns={columns}
                    getRowId={(row) => row._id}
                    onCellKeyDown={handleCellKeyDown}
                    cellModesModel={cellModesModel}
                    onRowClick={(newSelection) => {
                        setselectedRow(newSelection.row); setShowExistField(false);
                    }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 25 } },
                    }}
                    components={{
                        Toolbar: EditToolbar,
                    }}
                    componentsProps={{
                        toolbar: {
                            cellMode,
                            selectedCellParams,
                            setSelectedCellParams,
                            cellModesModel,
                            setCellModesModel,
                            setOpenNewAppDrawer,
                            setIsEdit,
                            setShowExistField,
                            selectedApp,
                            selectedTable,
                            selectedRow,
                            setTableColumns,
                        },
                        cell: {
                            onFocus: handleCellFocus,
                        },
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                />
                {openNewAppDrawer ?
                    <ColumnForm isEdit={isEdit} selectedTable={selectedTable} setTableColumns={setTableColumns} tableColumns={tableColumns} selectedRow={selectedRow} openNewAppDrawer={openNewAppDrawer} setOpenNewAppDrawer={setOpenNewAppDrawer}></ColumnForm>
                    :
                    null
                }
                {/* <TableDrawer initialState={openNewAppDrawer} isEdit={isEdit} closeOpenFlag={setOpenNewAppDrawer} selectedApp={selectedApp} selectedTable={selectedTable} tableColumns={tableColumns} selectedRow={selectedRow} showcolumnForm={true}></TableDrawer> */}
            </Box>
        </Drawer>
    );
}



//valuefield
const columns = [
    { headerName: 'Column Caption', field: 'label', width: 200, editable: true },
    { headerName: 'Column Name', field: 'shapevalue', width: 200, editable: true },
    {
        headerName: 'Data Type',
        field: 'type',
        type: 'singleSelect',
        width: 120,
        valueGetter: getTypeName,
    },
    {
        headerName: 'Related Table',
        field: 'dataref',
        width: 170, editable: false
    },
    {
        headerName: 'Related Column',
        field: 'valuefield',
        width: 150, editable: false
    },
    { headerName: 'Required', field: 'required', type: 'boolean', initialEditValue: true }
];

function getTypeName(params) {
    let typeName = "";
    switch (params.row.type) {
        case 301:
            typeName = 'Text'
            break;
        case 302:
            typeName = 'Number'
            break;
        case 320:
            typeName = 'Date'
            break;
        case 330:
            typeName = 'Boolean'
            break;
        case 370:
            typeName = 'Picture'
            break;
        case 380:
            typeName = 'Object'
            break;
        case 307:
            typeName = 'Table Ref'
            break;
        case 340:
            typeName = 'Lookup'
            break;
        case 341:
            typeName = 'Table Lookup'
            break;
        case 342:
            typeName = 'Reference to Lookup'
            break;
        default:
            typeName = 'N/A'
    }

    return typeName;
}

