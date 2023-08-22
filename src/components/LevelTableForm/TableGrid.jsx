import { useEffect, useState, useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import Stack from "@mui/material/Stack"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import { DataGrid, GridCellModes } from "@mui/x-data-grid"
import TableDrawer from "./TableDrawer"
import FormGrid from "./FormGrid"
// import { deleteTable, setSelectedTable } from 'redux/actions/tables';
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
//import { fetchFormByTable } from 'redux/actions/forms';
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import { Box, IconButton, TextField, Button } from "@mui/material"
import PagesHeader from "../basics/PagesHeader"
import tableApi from "../../api/tableApi"
import { setApplication } from "../../redux/features/applicationSlice"
import ColumnGrid from "./ColumnGrid"

//selectedTable
function EditToolbar(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    selectedCellParams,
    cellMode,
    cellModesModel,
    setCellModesModel,
    setOpenNewAppDrawer,
    setShowColumns,
    selectedApp,
    selectedRow,
  } = props
  const [deleteTableConfirmationCounter, setDeleteTableConfirmationCounter] =
    useState(2)
  const [snackbar, setSnackbar] = useState(null)
  const handleCloseSnackbar = () => setSnackbar(null)

  const handleSaveOrEdit = () => {
    if (!selectedCellParams) {
      return
    }
    const { id, field } = selectedCellParams
    if (cellMode === "edit") {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.View } },
      })
    } else {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.Edit } },
      })
    }
  }
  const handleCancel = () => {
    if (!selectedCellParams) {
      return
    }
    const { id, field } = selectedCellParams
    setCellModesModel({
      ...cellModesModel,
      [id]: {
        ...cellModesModel[id],
        [field]: { mode: GridCellModes.View, ignoreModifications: true },
      },
    })
  }
  const handleNewTable = () => {
    setOpenNewAppDrawer(true)
  }
  const dropTable = async () => {
    try {
      if (!selectedCellParams) {
        return
      }
      const { id, field } = selectedCellParams
      setDeleteTableConfirmationCounter(deleteTableConfirmationCounter - 1)
      if (deleteTableConfirmationCounter < 2) {
        const res = await tableApi.delete(
          selectedApp._id,
          id,
          selectedApp.dbname,
          selectedRow.name
        )

        console.log("--res----", res)
        dispatch(setApplication(res))

        if (res.name) {
          setSnackbar({ children: "Deleted successfully", severity: "success" })
        } else {
          setSnackbar({
            children: "Error occurred while trying to delete table",
            severity: "warning",
          })
        }
        setDeleteTableConfirmationCounter(2)
      }
    } catch (err) {
      setDeleteTableConfirmationCounter(2)
      console.log("--@3312 ", err)
      setSnackbar({ children: err.data.message, severity: "warning" })
    }
  }

  const showColumnsGrid = () => {
    console.log("selectedRow-00-", selectedRow)
    // if (!selectedCellParams) {
    //     return;
    // }

    setShowColumns(true)
    //navigate("/columns", { state: { selectedApp: { ...selectedApp }, selectedTable: { ...selectedRow }, stageId: 3 } });
  }

  const handleMouseDown = event => {
    // Keep the focus in the cell
    event.preventDefault()
  }

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        p: 1,
      }}
    >
      {" "}
      <Stack direction="row" spacing={1}>
        {/* <Button size="small"
                    onClick={handleSaveOrEdit}
                    onMouseDown={handleMouseDown}
                    disabled={!selectedCellParams}
                    variant="outlined"
                    sx={{ ml: 1 }}
                >
                    {cellMode === 'edit' ? 'Save' : 'Edit'}
                </Button> */}
        <Button
          disabled={selectedApp.length == 0}
          size="small"
          onClick={handleNewTable}
          variant="outlined"
          sx={{ ml: 1 }}
        >
          Add a table
        </Button>
        <Button
          size="small"
          onClick={dropTable}
          onMouseDown={handleMouseDown}
          disabled={!selectedRow._id}
          variant="outlined"
          sx={{ ml: 1 }}
        >
          {deleteTableConfirmationCounter > 1
            ? "Delete Table"
            : "Delete! Sure?"}
        </Button>
        <Button
          size="small"
          onClick={() => showColumnsGrid()}
          // onMouseDown={handleMouseDown}
          disabled={!selectedRow._id}
          variant="outlined"
          sx={{ ml: 1 }}
        >
          Table Columns
        </Button>
        {/* <Button size="small"
                    onClick={handleCancel}
                    onMouseDown={handleMouseDown}
                    disabled={cellMode === 'view'}
                    variant="outlined"
                    sx={{ ml: 1 }}
                >
                    Cancel
                </Button> */}

        {!!snackbar && (
          <Snackbar
            open
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            onClose={handleCloseSnackbar}
            autoHideDuration={6000}
          >
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </Stack>
    </Box>
  )
}

export default function TableGrid() {
  const [selectedCellParams, setSelectedCellParams] = useState(null)
  const [cellModesModel, setCellModesModel] = useState({})
  const [childNewAppDrawer, setOpenNewAppDrawer] = useState(false)
  const [showColumns, setShowColumns] = useState(false)
  const [selectedRow, setselectedRow] = useState({})
  // const forms = useSelector((state) => state.forms.value);
  const dispatch = useDispatch()
  const selectedApp = useSelector(state => state.application.value)
  const tableRows = useSelector(state => state.application.value.apptables)
  const [rows, setRows] = useState([])
  useEffect(() => {
    setselectedRow({})
    if (tableRows) {
      setRows(tableRows)
    } else {
      setRows([])
    }
  }, [tableRows])

  // useEffect(() => {
  //     dispatch(setSelectedTable(selectedRow._id));

  //     dispatch(fetchFormByTable(selectedApp._id, selectedRow._id));
  // }, [selectedRow]);

  const handleCellFocus = useCallback(event => {
    const row = event.currentTarget.parentElement
    const id = row.dataset.id
    const field = event.currentTarget.dataset.field
    setSelectedCellParams({ id, field })
  }, [])

  const cellMode = useMemo(() => {
    if (!selectedCellParams) {
      return "view"
    }
    const { id, field } = selectedCellParams
    return cellModesModel[id]?.[field]?.mode || "view"
  }, [cellModesModel, selectedCellParams, childNewAppDrawer])

  const handleCellKeyDown = useCallback(
    (params, event) => {
      if (cellMode === "edit") {
        // Prevents calling event.preventDefault() if Tab is pressed on a cell in edit mode
        event.defaultMuiPrevented = true
      }
    },
    [cellMode]
  )

  const handleProcessRowUpdateError = useCallback(error => {}, [])

  return (
    <>
      <Box>
        <Box sx={{ padding: "10px 50px" }}>
          <PagesHeader
            name={selectedApp.name}
            sitename={selectedApp.sitename}
          ></PagesHeader>
          <Divider></Divider>
          <center>
            <h3>Site Tables</h3>
          </center>
          <DataGrid
            pageSize={5}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            sx={{
              // disable cell selection style
              ".MuiDataGrid-cell:focus": {
                outline: "none",
              },
              // pointer cursor on ALL rows
              "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
              },
              minHeight: 350,
              maxHeight: 850,
            }}
            density="compact"
            rows={rows}
            columns={columns}
            getRowId={row => row._id}
            editMode="row"
            onCellKeyDown={handleCellKeyDown}
            cellModesModel={cellModesModel}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            onRowClick={newSelection => {
              setselectedRow(newSelection.row)
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: {
                cellMode,
                selectedCellParams,
                setSelectedCellParams,
                cellModesModel,
                setCellModesModel,
                setOpenNewAppDrawer,
                setShowColumns,
                selectedApp,
                selectedRow,
              },
              cell: {
                onFocus: handleCellFocus,
              },
            }}
          />
          {selectedRow.columns && showColumns ? (
            <ColumnGrid
              initialState={showColumns}
              selectedApp={selectedApp}
              selectedTable={selectedRow}
              closeOpenFlag={setShowColumns}
            ></ColumnGrid>
          ) : null}
          <TableDrawer
            initialState={childNewAppDrawer}
            closeOpenFlag={setOpenNewAppDrawer}
            selectedApp={selectedApp}
            showcolumnForm={false}
          ></TableDrawer>
          {/* <p></p>
            {Object.keys(selectedRow).length > 0 && forms ?<FormGrid tableForms={forms} selectedTable={selectedRow} selectedApp={selectedApp} ></FormGrid> : null}
         */}

          {/* {Object.keys(selectedRow).length > 0 ? <FormGrid selectedTable={selectedRow} ></FormGrid> : null} */}
        </Box>
      </Box>
    </>
  )
}

EditToolbar.propTypes = {
  childNewAppDrawer: PropTypes.oneOf(["edit", "view"]),
  cellModesModel: PropTypes.object.isRequired,
  selectedCellParams: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  setCellModesModel: PropTypes.func.isRequired,
  setOpenNewAppDrawer: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({}),
}

const columns = [
  { headerName: "Table Name", field: "name", width: 240, editable: true },
  {
    headerName: "Created",
    field: "createdAt",
    type: "date",
    valueGetter: ({ value }) => value && new Date(value),
    editable: false,
  },
]
