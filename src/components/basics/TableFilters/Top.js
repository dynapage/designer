import React, { useState } from 'react';
import { Input, InputAdornment, Box, } from '@mui/material';
import CheckBoxControl from '../CheckBoxControl';

const Top = ({controlFunc, dataValue}) => {
  const [query, setquery] = useState({ top: 50, istop: false });

  const handleTop = (e) => {
    //console.log( '------------options-------handleDescl:', e.target.value);
    setquery({ ...query, top: e.target.value })
  };

  const handleIsTop = (e) => {
    setquery({ ...query, istop: e.target.checked })
  };

  return (
    <Box display="flex" m={1} >
      <CheckBoxControl name={'isTop'} controlFunc={handleIsTop} title={'Top Row?'} controlValue={query.istop} />
      <Input
        id={'chkTop'}
        type={'number'}
        disabled={!query.istop}
        value={query.top}
        onChange={handleTop}
        startAdornment={
          <InputAdornment position="start">
            {'TOP:'}
          </InputAdornment>
        }
      />

    </Box>
  )
}


export default Top
