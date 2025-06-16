import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

export function DeletionConfirmationComponent(props) {
    const { onClose, warningMessage, open, onConfirm } = props;

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {warningMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm}>Yes</Button>
            </DialogActions>
        </Dialog>
    );
}

DeletionConfirmationComponent.propTypes = {
    open: PropTypes.bool.isRequired,
    warningMessage: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export function SearchComponent(props) {
    const { onSearch } = props;
    return (
        <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            slotProps={{
                input: {
                    endAdornment: (
                        <IconButton type="button" aria-label="search" size="small" onClick={onSearch}>
                            <SearchIcon />
                        </IconButton>
                    ),
                    sx: { pr: 0.5 },
                },
            }}
            sx={{ display: 'inline-block' }}
        />);
}

// function ToolbarActionsSearch() {
//   return (
//     <Stack direction="row">
//       <Tooltip title="Search" enterDelay={1000}>
//         <div>
//           <IconButton
//             type="button"
//             aria-label="search"
//             sx={{
//               display: { xs: 'inline', md: 'none' },
//             }}
//           >
//             <SearchIcon />
//           </IconButton>
//         </div>
//       </Tooltip>
//       <TextField
//         label="Search"
//         variant="outlined"
//         size="small"
//         slotProps={{
//           input: {
//             endAdornment: (
//               <IconButton type="button" aria-label="search" size="small">
//                 <SearchIcon />
//               </IconButton>
//             ),
//             sx: { pr: 0.5 },
//           },
//         }}
//         sx={{ display: { xs: 'none', md: 'inline-block' }, mr: 1 }}
//       />
//     </Stack>
//   );
// }