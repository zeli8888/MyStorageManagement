import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
export function DeletionConfirmation(props) {
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

DeletionConfirmation.propTypes = {
    open: PropTypes.bool.isRequired,
    warningMessage: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};