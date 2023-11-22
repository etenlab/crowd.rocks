import { ReactNode, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Backdrop,
  Modal as MuiModal,
  Fade,
  useMediaQuery,
} from '@mui/material';

export type ModalProps = {
  component: ReactNode;
  container?: HTMLElement | null;
  onClose(): void;
};

export function Modal({ component, onClose, container }: ModalProps) {
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
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '0px 20px',
            borderRadius: '20px',
            width: matches ? '600px' : 'calc(100vw - 30px)',
            maxWidth: '757px',
            maxHeight: '80%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 'calc(80vh - 40px)',
              margin: '20px 0',
              overflowY: 'auto',
            }}
          >
            {component}
          </Box>
        </Paper>
      </Fade>
    </MuiModal>
  );
}
