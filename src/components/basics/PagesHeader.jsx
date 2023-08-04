import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, IconButton, TextField, Button } from '@mui/material'

const PagesHeader = ({ name, sitename }) =>
(
    <Box>
        <Box >
            <TextField
                value={name}
                //onChange={updateTitle}
                placeholder='Untitled'
                variant='outlined'
                fullWidth
                sx={{
                    '& .MuiOutlinedInput-input': { padding: 0 },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                    '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
                }}
            />
            <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item>
                    <div>Site number:</div>
                </Grid>
                <Grid item>
                    <TextField
                        value={sitename}
                        placeholder='Site Number'
                        variant='outlined'
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-input': { padding: 0 },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                            '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
                        }}
                    />
                </Grid>
            </Grid>
        </Box>

    </Box>
)

export default PagesHeader