import { ReactNode, useState, useEffect } from 'react';
import {
  Paper,
  Backdrop,
  Modal as MuiModal,
  Fade,
  useMediaQuery,
} from '@mui/material';

export type FullModalProps = {
  component: ReactNode;
  container?: HTMLElement | null;
  onClose(): void;
};

export function FullModal({ component, onClose, container }: FullModalProps) {
  const matches = useMediaQuery('(min-width:765px)');
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (component) {
      setOpen(true);
    }
  }, [component]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      container={container}
    >
      <Fade in={open}>
        <Paper
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)!important',
            padding: 0,
            margin: 0,
            width: matches ? '600px' : '100vw',
            height: matches ? '700px' : '100vh',
            maxWidth: '777px',
            borderRadius: matches ? '20px' : 0,
            paddingTop: matches ? '20px' : '32px',
          }}
        >
          {component}
        </Paper>
      </Fade>
    </MuiModal>
  );
}
