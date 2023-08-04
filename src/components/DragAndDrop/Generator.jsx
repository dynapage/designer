import React from 'react';
import DnDCard from './DnDCard';
import DraggableContainer from './DraggableContainer';
const Generator = ({ items, groupName, type }) => {
  
  return (
    <DraggableContainer
    data={{ children: items }}
    groupName={groupName}
    behaviour="copy"
    emptyContent={null}
    orientation={'vertical'}
    childRenderer={(item, index) => {
        return (
          <DnDCard key={index} data={item} withoutProperties ></DnDCard>
        )
    }}
  />
  )
};

export default Generator;
