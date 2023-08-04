import React, { useState } from 'react';
import { Draggable } from 'react-smooth-dnd';
import classnames from 'classnames';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    marginTop: '0.3rem',
    padding: '0.1rem',
    background: 'white',
    fontSize: '0.8rem',
    cursor: 'move',
  },
  selected: {
    border: '1px solid lightblue',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0.2rem !important',
  },
});

export default function FieldChip(props) {

  const { data, withoutProperties } = props;
 // const [selected, setSelected] = useState(false);
 const classes = useStyles();
  const select = () =>
    !withoutProperties && setselected(true);

  const blur = () => setSelected(false);
  const handleOpenProperties = () =>
  !withoutProperties && props.onPropertiesOpen();

  return (
    <Draggable>
      <ClickAwayListener onClickAway={blur}>
      <Card
          className={classes.root}
          style={{ backgroundColor: data.backgroundcolor || '#FFFFFF' }}
          elevation={10}
          onClick={select}
          onDoubleClick={handleOpenProperties}>
          <CardContent className={classes.content}>
            <div style={{ color: data.color || '#000000' }}>{data.label}</div>
            <div>
              {!withoutProperties (
                <IconButton
                  onClick={handleOpenProperties}
                  color="primary"
                >
                  <MenuIcon size="small" />
                </IconButton>
              )}
            </div>
          </CardContent>
        </Card>
      </ClickAwayListener>
    </Draggable>
  );
}
