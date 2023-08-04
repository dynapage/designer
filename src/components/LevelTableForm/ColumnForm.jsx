import { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


//import { createColumn, updateColumn } from 'redux/actions/columns';
//import { fetchTables } from 'redux/actions/tables';
import { useSelector, useDispatch } from 'react-redux';
import Typography from "@mui/material/Typography";
import { InputLabel, Select, Box, MenuItem } from '@mui/material';
import FormControl from "@mui/material/FormControl";
import CheckBoxControl from '../basics/CheckBoxControl';
import TextBoxControl from '../basics/TextBoxControl';
import DatePickerProperties from '../basics/DatePickerProperties';
import AddRemoveList from './AddRemoveList'

import { useParams } from 'react-router-dom'
//import { fetchLookUpTableColumns } from 'redux/actions/columns';
import tableApi from '../../api/tableApi'
import columnApi from '../../api/columnApi'
import { setTables } from '../../redux/features/tablesSlice'



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function ColumnForm({ openNewAppDrawer, setOpenNewAppDrawer, isEdit, selectedRow, selectedTable, tableColumns, setTableColumns }) {
    let colData = { type: 301, shapevalue: "", valuefield: "", label: "", checked: false, texttype: 1, multiline: false, required: false, validation: false, dataref: "", tablecolumn: true, datarefid: "", defaultvalue: "", formattype: 0 };
    const [controlData, setControlData] = useState(!isEdit ? { ...colData } : { ...selectedRow });
    // const [listOfTables, setListOfTables] = useState(apptables);
    const [choiceItems, setChoiceItems] = useState(!isEdit ? [] : selectedRow.datafield);
    const [colNames, setColNames] = useState();
    const dispatch = useDispatch();
    let fieldDataTypes = [
        { _id: 301, label: 'Text' },
        { _id: 302, label: 'Number' },
        { _id: 320, label: 'Date' },
        { _id: 330, label: 'Boolean (Yes/No)' },
        { _id: 370, label: 'Picture' },
        { _id: 380, label: 'Object/File' },
        { _id: 340, label: 'Lookup List' },
        { _id: 341, label: 'Lookup from Table' },
    ];

    const selectedApp = useSelector((state) => (state.application.value));
    const appTables = useSelector((state) => (state.tables.value || []).apptables);
    const { applicationId } = useParams()


    // useEffect(() => {
    //     if (listOfTables === undefined) {
    //         dispatch(fetchTables(selectedApp._id));
    //         setListOfTables(appTables);
    //     }
    // }, []);


    useEffect(() => {
        const getTables = async () => {
            try {
                const res = await tableApi.getAll(applicationId)
                console.log('------------setTables--------------  ', res)
                dispatch(setTables(res))

            } catch (err) {
                alert('@c32--' + err)
            }
        }
        getTables()
    }, [])

    useEffect(() => {

        setControlData({ ...controlData, datafield: choiceItems });
    }, [choiceItems]);


    const generateDataTypes = () => {
        const isRefColExists = tableColumns.find(({ type }) => type === 342);
        const isLookupColExists = tableColumns.find(({ type }) => type === 341);
        // console.log(!!isLookupColExists, '------------tableColumns------------', !isRefColExists)
        if (!!isLookupColExists && !isRefColExists) {
            fieldDataTypes.push({ _id: 342, label: 'Referenced Lookup' })
        }
        return fieldDataTypes;
    };

    const handleTextChange = (e) => {
        console.log('//-useEffect-------', e.target)
        if (e.target.name == 'label') {
            let fieldName = e.target.value;
            let cleansedName = fieldName.replace(/ /g, "").toLowerCase();
            setControlData({ ...controlData, [e.target.name]: e.target.value, shapevalue: cleansedName })
        }
        else {
            setControlData({ ...controlData, [e.target.name]: e.target.value })
        }
    };

    const handleRefColumnChange = (e) => {
        try {
            const selectedTableProps = appTables.find(({ _id }) => _id === controlData.datarefid);
            setControlData({ ...controlData, [e.target.name]: e.target.value, dataref: selectedTableProps.name, relatedrefcolumn: e.target.value })
        }
        catch (err) {
            console.log('Error in handleRefColumnChange: ', err)
        }
    };

    const handleTableRefChange = (e) => {
        //** If none is selected */
        if (e.target.value === undefined)
        {
            setControlData({ ...controlData, dataref: "", datarefid: "", valuefield: "" });
        }
        else
        {
            setControlData({ ...controlData, dataref: e.target.value.name, datarefid: e.target.value._id });
            tableApi.getLookupColumns(
                selectedApp._id,
                e.target.value._id).then(data => {
                    setColNames(data)
                })
        }
      
    };

    const handleRefTableChange = (e) => {
        try {
            //  console.log(controlData, '------------++9-------------', e.target.value)
            setControlData({ ...controlData, relatedreflookup: e.target.value.valuefield, valuefield: e.target.value.shapevalue, datarefid: e.target.value.datarefid });
            if (e.target.value.datarefid)
                tableApi.getLookupColumns(selectedApp._id, e.target.value.datarefid).then(data => {
                    setColNames(data)
                })
        }
        catch (err) {
            console.log("err @5173 ", err)
        }
    };

    const handleCheckboxChange = (e) => {
        if (e.target.name == 'defaultvalue') {
            if (e.target.checked) {
                setControlData({ ...controlData, defaultvalue: '#now' })
            }
            else {
                setControlData({ ...controlData, defaultvalue: '#notnow' })
            }
        }
        else {
            setControlData({ ...controlData, [e.target.name]: e.target.checked })
        }
    };


    const handleSubmit = async event => {
        try {
            //tableColumns
            let columnCount = tableColumns.length;
            let isColumnExists = false;

            tableColumns.map((item) => {
                if (item.shapevalue.toLowerCase() === controlData.shapevalue.toLowerCase()) isColumnExists = true
            })

            let fieldVal = controlData.shapevalue;
            if (isColumnExists == true) {
                alert("Column name already exists")
            }
            else {
                if (fieldVal != "") {
                    setControlData({ ...controlData, valuefield: fieldVal })
                    if (columnCount > 24) {
                        alert("You have reached the maximum number of column, this version supports up to 25 column per table")
                    }
                    else {
                        const res = await columnApi.create(applicationId, selectedTable._id, selectedApp.dbname, selectedTable.name, controlData)
                        setTableColumns(res)
                        setOpenNewAppDrawer(false);
                    }
                }
            }
        }
        catch (err) {
            alert('@216--' + err)
        }
    };

    const handleSave = async event => {
        //console.log('//---handleSave----------', controlData, '----', isEdit)
        let fieldVal = controlData.shapevalue;
        if (fieldVal != "") {
            setControlData({ ...controlData, valuefield: fieldVal })
            const res = await columnApi.update(applicationId, selectedTable._id, selectedRow._id, controlData)
            setTableColumns(res)
            setOpenNewAppDrawer(false);
        }
    };

    const handleClickOpen = () => {
        setOpenNewAppDrawer(true);
    };
    const handleClose = () => {
        setOpenNewAppDrawer(false);
    };

    return (
        <div>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openNewAppDrawer}
                fullWidth
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Column Form
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Box
                        component="form"
                        sx={{ "& > :not(style)": { m: 1, width: "45ch" } }}
                        noValidate
                        autoComplete="off">
                        <br />
                        <TextBoxControl required key={'txtCaption'} name={'label'} controlValue={controlData.label} controlFunc={handleTextChange} inputType={'text'} title={"Column Caption"} />
                        <TextBoxControl required key={'txtName'} controlValue={controlData.shapevalue} name={'shapevalue'} controlFunc={handleTextChange} inputType={'text'} title={"Column Name"} ></TextBoxControl>
                        <Box sx={{ minWidth: 200 }}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                <InputLabel id="demo-simple-select-label">Data Type</InputLabel>
                                <Select
                                    required
                                    labelId="data-type-label"
                                    id="type"
                                    name={'type'}
                                    value={controlData.type}
                                    placeholder={'Data Type'}
                                    onChange={handleTextChange}
                                    key={'selectType'}
                                    label="Data Type">
                                    {generateDataTypes().map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        {controlData.type == 340 ? <AddRemoveList choiceItems={choiceItems} choiceItemsData={setChoiceItems}></AddRemoveList> : null}
                        {controlData.type == 341 && controlData ?
                            <Box sx={{ minWidth: 200 }}>
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                    <InputLabel id="demo-simple-select-label">Tables</InputLabel>
                                    <Select
                                        labelId="data-type-label"
                                        id="valuefield"
                                        name={'valuefield'}
                                        //value={controlData.type}
                                        placeholder={'Tables'}
                                        onChange={handleTableRefChange}
                                        key={'selectTables'}
                                        label="Tables List"
                                    >
                                        <MenuItem >
                                            <em>None</em>
                                        </MenuItem>
                                        {appTables.map((item) => (
                                            <MenuItem key={item._id} value={item}>
                                                {item.name}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Box>
                            :
                            controlData.type == 342 && controlData ?
                                <Box>
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                        <InputLabel id="demo-simple-select-label">Select Lookup column</InputLabel>
                                        <Select
                                            labelId="data-type-label"
                                            id="relatedreflookup"
                                            name={'relatedreflookup'}
                                            //value={controlData.type}
                                            placeholder={'Tables'}
                                            onChange={handleRefTableChange}
                                            key={'selectTables'}
                                            label="Tables List" >
                                            <MenuItem value={''}>
                                                <em>None</em>
                                            </MenuItem>
                                            {tableColumns.map((item) => {
                                                if (item.type == 341)
                                                    return (
                                                        <MenuItem key={item._id} value={item}>
                                                            {item.label}
                                                        </MenuItem>
                                                    )
                                            })}
                                        </Select>
                                        <br></br>

                                    </FormControl>
                                </Box>
                                :
                                null}
                        {generateDefaultValueControl(controlData.type)}
                        {controlData.type == 301 ? <CheckBoxControl key={'shapevalue'} name={'multiline'} controlFunc={handleCheckboxChange} title={'Mltiline'} controlValue={controlData.multiline} />
                            : null}
                        <CheckBoxControl key={'required'} name={'required'} controlFunc={handleCheckboxChange} title={'Required'} controlValue={controlData.required} /><p></p>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={(event) => isEdit ? handleSave(event) : handleSubmit(event)}>
                        Save changes
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );


    function generateDefaultValueControl(type) {
        switch (type) {
            case 301:
                return (
                    <TextBoxControl required key={'txtDefaultValue'} controlValue={controlData.defaultvalue} name={'defaultvalue'} controlFunc={handleTextChange} inputType={'text'} title={"Default Value"} ></TextBoxControl>
                )
                break;
            case 302:
                return (
                    <TextBoxControl required key={'numDefaultValue'} controlValue={controlData.defaultvalue} name={'defaultvalue'} controlFunc={handleTextChange} inputType={'number'} title={"Default Value"} ></TextBoxControl>
                )
                break;
            case 320:
                return (
                    <CheckBoxControl key={'chkDefaultValue'} name={'defaultvalue'} controlFunc={handleCheckboxChange} title={'Default Value = Today/Now?'} controlValue={controlData.defaultvalue == '#now' ? true : false} />
                )
                break;
            case 330:
                return (
                    <Box sx={{ minWidth: 200 }}>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                            <InputLabel id="demo-simple-select-label">Default Value</InputLabel>
                            <Select
                                required
                                labelId="data-type-label"
                                id="cbodefaultvalue"
                                name={'defaultvalue'}
                                value={controlData.defaultvalue}
                                placeholder={'Default Value'}
                                onChange={handleTextChange}
                                key={'selectTypedefaultvalue'}
                                label="Default Value">
                                <MenuItem key={1} value={'true'}>
                                    {'true'}
                                </MenuItem>
                                <MenuItem key={2} value={'false'}>
                                    {'false'}
                                </MenuItem>
                                <MenuItem key={0} value={'empty'}>
                                    {'empty'}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )
                break;
            case 340:
                //choiceItems
                return (
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel id="demo-simple-select-label">Default Value CBC</InputLabel>
                        <Select
                            required
                            labelId="data-type-label"
                            id="cbochoiceItems"
                            name={'defaultvalue'}
                            value={controlData.defaultvalue}
                            placeholder={'Default Value'}
                            onChange={handleTextChange}
                            key={'selectTypedchoiceItems'}
                            label="Default Value">
                            {choiceItems.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                )
                break;
            case 341:
                if (colNames) {
                    return (
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                            <InputLabel id="demo-simple-select-label">Field to show</InputLabel>
                            <Select
                                required
                                labelId="data-type-label"
                                id="cbochoiceItems"
                                name={'valuefield'}
                                value={controlData.valuefield}
                                placeholder={'Field to show'}
                                onChange={handleTextChange}
                                key={'selectTypedchoiceItems'}
                                label="Field to show">
                                {
                                    colNames.map((opt) => {
                                        return (
                                            <MenuItem key={opt._id} value={opt.shapevalue}>
                                                {opt.label}
                                            </MenuItem>
                                        )
                                    })}
                            </Select>
                        </FormControl>
                    )
                }
                break;
            //referenced lookup field
            case 342:
                if (colNames) {

                    return (
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                            <InputLabel id="demo-simple-select-label">Field to show</InputLabel>
                            <Select
                                required
                                labelId="data-type-label"
                                id="cbochoiceItems"
                                name={'relatedrefcolumn'}
                                value={controlData.relatedrefcolumn}
                                placeholder={'Field to show'}
                                onChange={handleRefColumnChange}
                                key={'selectTypedchoiceItems'}
                                label="Field to show">
                                <MenuItem key={'0val'} value={0}></MenuItem>
                                {
                                    colNames.map((opt) => {
                                        return (
                                            <MenuItem key={opt._id} value={opt.shapevalue}>
                                                {opt.label}
                                            </MenuItem>
                                        )
                                    })}
                            </Select>
                        </FormControl>
                    )
                }
                break;
            default:
                return (
                    <TextBoxControl required key={'txtDefaultValue'} controlValue={controlData.defaultvalue} name={'defaultvalue'} controlFunc={handleTextChange} inputType={'text'} title={"Default Value"} ></TextBoxControl>
                )
        }
    };
}