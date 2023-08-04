
import { useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import classnames from 'classnames';
import MenuIcon from '@mui/icons-material/Menu';


function DraggableContainer(props) {

  const {
    data: { children, label },
    onDrop,
    orientation = 'vertical',
    className,
    emptyContent,
    childRenderer=() => null,
    groupName,
    behaviour= 'move',
    shouldAcceptDrop,
    isDraggable = true,
  } = props;


  const [isDropping, setisDropping] = useState(true);
  const handleDragEnter = () => setisDropping(true);
  const handleDragLeave = () => setisDropping(false);

  const containerClassName = classnames(className, {
    '--empty': !children || !children.length,
    '--dropping': isDropping,
  });

  const renderContainer = () => {

    ////console.log('----children', children)
return (
    <div className={containerClassName} >
      {label && <h5>{label}</h5>}
      <Container
        groupName={groupName}
        orientation={orientation}
        behaviour={behaviour}
        onDrop={onDrop}
        shouldAcceptDrop={shouldAcceptDrop}
        getChildPayload={(i) => children[i]}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {children && children.length
          ? children.map(childRenderer)
          : emptyContent}
      </Container>
    </div>
  )};


  return (
    isDraggable ? (
      <Draggable>

        {renderContainer()}</Draggable>
    ) :
      (
        renderContainer()
      )
  )
}

export default DraggableContainer