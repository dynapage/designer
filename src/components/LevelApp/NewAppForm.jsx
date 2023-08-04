import * as React from "react";
import { useSelector, useDispatch } from 'react-redux';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";

import applicationApi from '../../api/applicationApi'
import { setApplications } from '../../redux/features/applicationsSlice'


function randStr(len, chars = 'abcdefghklmnystupqvABCDEFJHKLMNYSZT0123456789') {
    let s = '';
    while (len--) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}


function getSiteNumber(docCount) {
    let chars = '123456789';
    let rndNo = Number(chars[Math.floor(Math.random() * 3)]);


    // If API fales to return app counts
    let docNo = Math.floor(Math.random() * 9999);
    if (Number(docCount.doCount)) {
        docNo = Number(docCount.doCount);
    }
    let initNo = Number(1730);
    if (docNo == 0 || docNo == undefined) {
        return (Number(initNo) + Number(rndNo)).toString()
    }
    else {
        return (Number(initNo) + Number(docNo)).toString()
    }
}

export default function NewAppForm({ setNewSite, designer }) {
    const [newAppName, setnewAppName] = React.useState("");
    const dispatch = useDispatch();
    const applications = useSelector((state) => state.applications.value)

    const handleSubmit = async event => {
        const docCount = 5; //await dispatch(fetchApplicationsCount(designer.userId));


        const siteNo = getSiteNumber(docCount);
        let appdata = {};
        let appname = newAppName.trim();
        const nameCleaned = appname.replace(/[|&/\*#={}\£`';$%@\"<>()+,]/g, 'c')
        appdata.name = nameCleaned;
        const dbNameCleaned = nameCleaned.replace(/\s/g, '_')
        appdata.dbname = dbNameCleaned + randStr(19);
        appdata.sitename = String(siteNo);
        const appdesigner = ([{ 'userId': designer, 'username': designer }])

        const appadmin = ([{ 'accessType': 4, 'teamName': 'Admins', 'users': [{ 'userId': designer, 'username': designer, 'userpwd': randStr(12) }] },
        { 'accessType': 1, 'teamName': 'Team1', 'users': [] },
        { 'accessType': 2, 'teamName': 'Team2', 'users': [] },
        { 'accessType': 3, 'teamName': 'Team3', 'users': [] },
        { 'accessType': 3, 'teamName': 'Team4', 'users': [] }

        ])

        appdata.designers = appdesigner;
        appdata.teams = appadmin;
        if (newAppName != "") {

            if (Array.isArray(applications)) {
                if (applications.length > 3) {
                    alert("Maximum applications limit reached")
                    return
                }
            }
            try {
                const res = await applicationApi.create(designer, appdata)
                // const newList = [res, ...applications]
                dispatch(setApplications(res))
                setNewSite(false)
            }
            catch (err) {
                console.log("@err 6512---", err, '-body-', appdata)
                alert("Application not created, check the app log for erros, please refresh the app and try again")
            }

        }
    };

    return (
        <Box
            component="form"
            sx={{
                "& > :not(style)": { m: 1, width: "45ch" }
            }} noValidate autoComplete="off">

            <p>New Site Name (5 to 18 characters long)</p>
            <FormControl variant="filled">
                <TextField
                    placeholder="Enter the new Site name"
                    label="Site Name"
                    name="txtappname"
                    variant="outlined"
                    fullWidth
                    required
                    onChange={(e) => setnewAppName(e.target.value)}
                />
            </FormControl>
            <p></p>
            <Button variant="contained" disabled={newAppName.trim().length < 5} size="medium" onClick={(event) => handleSubmit(event)} sx={{ ml: 1 }}>
                Save changes
            </Button>
            <Button variant="contained" size="medium" onClick={() => setNewSite(false)} sx={{ ml: 1 }}>
                Cancel
            </Button>

        </Box>
    );
}
