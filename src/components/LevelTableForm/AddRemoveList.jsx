import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from "@mui/material/Button";
import TextBoxControl from '../basics/TextBoxControl';


export default function AddRemoveList({ choiceItemsData, choiceItems }) {
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [listItem, setListItem] = useState("");
    const [listItems, setListItems] = useState([]);

    useEffect(() => {

        setListItems(choiceItems)
    }, [choiceItems]);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handleAddListItem = (event) => {
        const nameCleaned = listItem.replace(/[|/\*={}\`';%\"<>()+,]/g, 'c')
        let isItemExists = false;

        choiceItems.map((item) => {
            if (item === nameCleaned) {
                isItemExists = true;
            }
        })

        if (nameCleaned.trim() === "") {
            return
        }
        if (nameCleaned.length > 26) {
            alert("Item text is too long")
            return
        }

        if (isItemExists) {
            alert("Item already exists")
        }
        else {
            if (choiceItems.length > 6) {
                alert("You have reached maximum amount of items")
            }
            else {
                choiceItemsData([...choiceItems, nameCleaned]);
            }
        }
    };

    const handleRemoveListItem = () => {
        var array = choiceItems;
        array.splice(selectedIndex, 1);
        if (selectedIndex == 0 && array.length == 0) {
            array = []
        }
        choiceItemsData(array)
        setSelectedIndex(0);
    };


    return (
        <Box sx={{ width: '100%', maxWidth: 660, border: 1 }}>
            <TextBoxControl key={'txtCaption'} name={'label'} controlFunc={(e) => setListItem(e.target.value)} inputType={'text'} title={"New Lookup List Item"} />
            <p></p>
            <Button variant="contained" size="medium" onClick={(event) => handleAddListItem(event)} sx={{ ml: 1 }}>
                Add
            </Button><Button variant="outlined" size="medium" onClick={handleRemoveListItem} sx={{ ml: 1 }}>
                Remove
            </Button><p></p>
            <Divider></Divider>
            <List component="nav" aria-label="secondary mailbox folder">
                {listItems.map((item, index) => (
                    <ListItemButton key={index}
                        selected={selectedIndex === index}
                        onClick={(event) => handleListItemClick(event, index)}>
                        <ListItemText primary={item} />
                    </ListItemButton>
                )
                )}
            </List>
        </Box>
    );
}
