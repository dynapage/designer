import React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

export default function DnDChip(props) {

  return (
    <Draggable
      data={props.items}
      className={'dnd-controls-text__item'}
    //  groupName="row"
    // onDrop={onDrop}
    >
      <Container >
          <Chip sx={{ width: '98%', cursor: 'grab'}} variant="outlined" avatar={<Avatar>{props.items.generatorOptions.columnCount}</Avatar>} key={props.items.label} color="primary" component="a" clickable size="small" label={props.items.label} />
      </Container>
    </Draggable>
  );
}
