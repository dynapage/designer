
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';



export const NavigationBar = ({selectedAppName}) => {
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Link href="/" color='white' underline="hover" variant='overline' sx={{ flexGrow: 1 }}>
                            <Box sx={{ fontSize: 'h6.fontSize', m: 0, extTransform: 'capitalize' }}>{selectedAppName}</Box>
                        </Link>&nbsp;
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Box sx={{ m: 4 }} />
                            <Box sx={{ fontStyle: 'italic', m: 0 }}>by</Box>
                            <Link href="https://www.dynapage.co.uk/" color='white' underline="hover" variant='overline' sx={{ flexGrow: 1 }}>
                                <Box sx={{ typography: 'subtitle2', flexGrow: 0, m: 1 }} >Dynanet</Box></Link>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box >
        </>
    );
};
