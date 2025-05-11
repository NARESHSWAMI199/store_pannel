import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Confetti from 'react-confetti';
import { ruppeeIcon } from 'src/utils/util';

const CongratulationDialog = ({ open, onClose,activePlan }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ textAlign: 'center' }}
    >
      <Confetti
        width={400}
        height={200}
        recycle={false}
        numberOfPieces={100}
      />
      <DialogTitle>
        <CelebrationIcon color="success" sx={{ fontSize: 40 }} />
      </DialogTitle>
      <DialogContent>
        <Typography variant="h5" component="h2" gutterBottom>
          🎉 Congratulations! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You have successfully purchased the <strong>{activePlan?.name}</strong> plan. price of <strong>{ruppeeIcon + activePlan?.price}</strong>.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button variant="contained" onClick={onClose}>
          Okay, Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CongratulationDialog;