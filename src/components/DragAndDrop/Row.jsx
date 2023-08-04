import React from 'react';
import DraggableContainer from './DraggableContainer';
import Cell from './Cell';
import { makeStyles } from '@mui/styles';


export default ({data, data: { children } = {}, onDrop, onPropertiesOpen, themeMode }) => {
  return (
    <DraggableContainer
    data={data}
    key={`table__row${data.id}`}
    className={themeMode=="dark"? "dnd-table__rowDark" :"dnd-table__row"}
    groupName="row"
    orientation="horizontal"
    onDrop={onDrop}
    childRenderer={(item, index) => 
     (
      <Cell 
        key={item.id}
        data={item}
        onDrop={onDrop.bind(null, index)}
        onPropertiesOpen={onPropertiesOpen.bind(null, item.id)}
      >
      </Cell>
    )}
  />
)};
