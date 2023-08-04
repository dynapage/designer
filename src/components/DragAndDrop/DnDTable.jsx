import React from 'react';
import { Container } from 'react-smooth-dnd';
import Row from './Row';
import { makeStyles } from '@mui/styles';
import '../../css/index.scss';


const useStyles = makeStyles({
  root: {
    margin: '1rem',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid',
    color: '#dbd6d5',
    fontSize: '1.5rem',
    textAlign: 'center',
    fontWeight: 'normal',
    width: '98%'
    
  },
});

function DnDTable(props) {
  const classes = useStyles();
  const { data, onPropertiesOpen, onChange, themeMode } = props;

  const handleDrop = (...args) => {
    // //console.log('...args:', ...args)
    const changes = args.pop();
    const { removedIndex, addedIndex } = changes;
    if (removedIndex === null && addedIndex === null) return;

    onChange(changes, args);
  }

  const handlePropertiesOpen = (...path) => {
    onPropertiesOpen(path);
  }

  const getRowPayload = (index) => data[index];

  return (
    <div style={{ width: '100%' }}>
      <Container
        key={'container'}

        dragHandleSelector={''}
        nonDragAreaSelector={''}
        dragBeginDelay={1}
        animationDuration={1}
        autoScrollEnabled={true}
        groupName="table"
        onDrop={handleDrop}
        getChildPayload={getRowPayload}
      >
        {data && data.length
          ? data.map((item, index) => 
         (
            <Row
              key={'row' + item.id}
              themeMode = { themeMode }
              data={item}
              path={index}
              onDrop={handleDrop.bind(this, index)}
              onPropertiesOpen={handlePropertiesOpen.bind(
                this,
                item.id
              )}
            />
          ))
          : <div  className={classes.root}>
            <Container dragHandleSelector={''}
              nonDragAreaSelector={''}
              dragBeginDelay={1}
              animationDuration={1}
              autoScrollEnabled={true}
            >To Start: Drop a container here from left hand-side menu</Container>
          </div>}
      </Container>
    </div>
  );
}

export default DnDTable
