
import React from 'react';
import { Container } from 'react-smooth-dnd';
import { withStyles } from '@mui/styles';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

const useStyles = {
  root: {

    width: '40%',
    margin: '2rem',
    padding: '2rem',
    borderRadius: '1rem',
    border: '0.5px solid',
    color: '#fa9a93',
    fontSize: '1rem',
    textAlign: 'center',
    fontWeight: 'normal'

  },
};

export default withStyles(useStyles)(({ classes }) => (
  <div className={classes.root}>
    <Container shouldAcceptDrop={() => true}> Drop here to delete</Container><DeleteOutlinedIcon />
  </div>
));

