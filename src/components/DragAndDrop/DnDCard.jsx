import React, { useState } from 'react';
import { Draggable } from 'react-smooth-dnd';
import { makeStyles } from '@mui/styles';
//import classnames from 'classnames';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Chip from '@mui/material/Chip';
import { Box } from '@mui/material'


const DnDCard = (props) => {

  const { data, withoutProperties } = props;
  const [selected, setselected] = useState(false);

  const select = () =>
    !withoutProperties && setselected(true);

  const blur = () => setselected(false);

  const handleOpenProperties = () =>
    !withoutProperties && props.onPropertiesOpen();
    
  return (
    <Draggable >
      <ClickAwayListener key={`cell_${data.id}`} onClickAway={blur}>
        <Box
          sx={{ m: 0.4, } }>
          <Chip sx={{ width: '100%', cursor: 'grab', backgroundColor: data.backgroundcolor != "#FFFFFF" & data.backgroundcolor != "#ffffff"? data.backgroundcolor:  null }} label={data.label} variant="outlined" elevation={10}
            onClick={select}
            onDoubleClick={handleOpenProperties}>
          </Chip>
          {!withoutProperties && selected && (
            <Button size="small"
              onClick={handleOpenProperties} startIcon={<SettingsOutlinedIcon />}
            >Component properties</Button>

          )}
        </Box>

      </ClickAwayListener>
    </Draggable>
  );
}

export default DnDCard;