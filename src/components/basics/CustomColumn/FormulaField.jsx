
import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, MenuItem, Box } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const operatorSum = [{ value: 1, label: 'Plus' }, { value: 2, label: 'Minus' }, { value: 3, label: 'Devide' }, { value: 4, label: 'Times' }];

const FormulaField = ({ controlFunc, selectedForm, setFormulaDrawer, formulaDrawer }) => {
    const { data } = useSelector((state) => state.sections);
    const [fieldList, setFieldList] = useState([])
    const [formulaField, setFormulaField] = useState('')
    const [formulaList, setFormulaList] = useState([{ key: 0, field: '', operator: '' }])

    //console.log('--------------------jjjjj       ', selectedForm.formula?.formulaFld)
    useEffect(() => {
        const getShapes = async () => {
            let items = []
            data.map((parent) => {
                parent.children.map((child) => {
                    child.children.map((item) => {
                       // if (item.type === 302 && item.shapevalue != selectedForm.formula?.formulaFld) {
                            items.push(item)
                       // }
                    })
                })
            })
            setFieldList(items)

            if (selectedForm.formula.formulaList) {
                setFormulaList(selectedForm.formula?.formulaList)
            }
        }
        getShapes()
    }, [data])


    const handleAddItem = () => {
        setFormulaList([...formulaList, { key: formulaList.length, field: '', operator: '' }])
    };

    const handleTargetField = (val) => {
        setFormulaField(val.target.value)
    };

    const handleAddField = (val, index) => {
        const item = formulaList[index]
        item.field = val.target.value
        formulaList[index] = item
        //console.log('//--fieldList---', formulaList)
    };

    const handleAddOperator = (val, index) => {
        const item = formulaList[index]
        item.operator = val.target.value
        formulaList[index] = item


    };
    const handleClose = () => {
        // setOpenNewAppDrawer(false);
    };
    const handleSave = () => {
        let data = { formulaFld: formulaField, formulaList }
        controlFunc(data)
        setFormulaDrawer(false)
    };
    const handleCancel = () => {
        setFormulaDrawer(false)
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={formulaDrawer}
            fullWidth
        >

            <DialogContent dividers>
                <Box p={0} >
                    <Box p={1}>Apply to
                        <TextField
                            style={{ "minWidth": "140px" }}
                            id={'formulayfield2_'}
                            select
                            label="Numeric Field"
                            value={selectedForm.formula?.formulaFld}
                            onChange={(e) => handleTargetField(e)}>
                            {
                                fieldList.map((opt) => (
                                    <MenuItem key={opt.shapevalue} value={opt.shapevalue}>
                                        {opt.label}
                                    </MenuItem>
                                ))
                            }
                        </TextField>
                    </Box>
                    {fieldList && formulaList.map((item, index) => {
                        //console.log('//--fieldList---', item, index)
                        return (
                            <Box p={1}>
                                <TextField
                                    style={{ "minWidth": "140px" }}
                                    id={'numericfield2_' + index}
                                    select
                                    label="Numeric Field"
                                    value={item.field}
                                    onChange={(e) => handleAddField(e, index)}
                                >
                                    {
                                        fieldList.map((opt) => (
                                            <MenuItem key={opt.shapevalue} value={opt.shapevalue}>
                                                {opt.label}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>

                                <TextField
                                    style={{ "minWidth": "140px" }}
                                    id="numericfield2"
                                    select
                                    label="Numeric Field"
                                    value={item.operator}
                                    onChange={(e) => handleAddOperator(e, index)}
                                >
                                    {
                                        operatorSum.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                                <IconButton aria-label="add" onClick={handleAddItem} key={'formattypeadd'} ><AddIcon /></IconButton>
                            </Box>
                        )
                    })
                    }
                </Box>

            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={(event) => handleSave(event)}>
                    Save changes
                </Button>
                <Button onClick={() => handleCancel()}>
                    Cancel
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )
}


export default FormulaField
