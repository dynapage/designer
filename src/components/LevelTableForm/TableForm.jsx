import React from 'react';

import { useDispatch } from 'react-redux';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";

import tableApi from '../../api/tableApi'
import { setApplication } from '../../redux/features/applicationSlice'



export default function TableForm({ selectedApp, closeDrawer }) {

    const [newTableName, setnewTableName] = React.useState("");
    const dispatch = useDispatch();

    const handleSubmit = async event => {
        try {
            let tableData = {};
            let tableCount = selectedApp.apptables.length;
            let checkTablExists = false;
            const tblNameCleaned = newTableName.trim()
            tableData.name = tblNameCleaned;

            selectedApp.apptables.map((item) => {
                if (item.name.toLowerCase() === tblNameCleaned.toLowerCase()) {
                    checkTablExists = true;
                }
            }
            )
            if (checkTablExists) {
                alert("table name already exists")
            }
            else {
                if (tblNameCleaned != "") {
                    if (tableCount > 24)
                    {
                        alert("You have reached the maximum number of tables, this version supports up to 25 tables")
                    }
                    else
                    {
                        const res = await tableApi.create(selectedApp._id, selectedApp.dbname, tableData);
                        dispatch(setApplication(res))
                        closeDrawer(false);
                    }
                    
                }
                else {
                    alert("Table name cannot be empty")
                }
            }
        }
        catch (err) {
            console.log('err @3124 ', err)
        }
    };

    // const closeForm = event => { event.preventDefault(); }

    return (
        <Box sx={{
            justifyContent: 'space-between',
            p: 2,
            minWidth: 450
        }}><br /><br /><br />
            <p>New Table Name</p>
            <FormControl variant="filled">
                <TextField
                    placeholder="Enter the new Table name"
                    label="Table Name"
                    name="txtName"
                    variant="outlined"
                    sx={{ width: 300 }}
                    required
                    onChange={(e) => setnewTableName(e.target.value)}
                />
            </FormControl>
            <p></p>
            <Button variant="contained" size="medium" onClick={(event) => handleSubmit(event)} sx={{ ml: 1 }}>
                Submit
            </Button>
        </Box>
    );
}
