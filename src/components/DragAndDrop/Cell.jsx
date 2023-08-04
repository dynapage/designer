import React from 'react';
import { makeStyles } from '@mui/styles';
import DraggableContainer from './DraggableContainer';
import DnDCard from './DnDCard';



export default (({ data, data: { children } = {}, onDrop, onPropertiesOpen }) => {
  //  console.log(data, '---------------------DraggableContainer------------=====================================')

    return (
      <DraggableContainer
        data={data}
        key={`cell_${data.id}`}
        //key={'raggablecontainer'}
        groupName="cell"
        onDrop={onDrop}
        emptyContent={null}
        childRenderer={(item, index) => {
          return (
            <DnDCard
              key={item.id}
              data={item}
              onPropertiesOpen={onPropertiesOpen.bind(null, item.id)}
            />
          )
        }
        }
      />
    )
  })
  
  

