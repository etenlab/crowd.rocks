import { MouseEventHandler, useState } from 'react';
import {
  Typography,
  Stack,
  Divider,
  InputBase,
  IconButton,
  useTheme,
} from '@mui/material';
import { NavArrowRight } from '../icons/NavArrowRight';
import { Cancel } from '../icons/Cancel';
import { Check } from '../icons/Check';

import { useTr } from '../../../hooks/useTr';

import { Div } from './styled';

export type WordItemProps = {
  word: string;
  description: string;
  viewData?: {
    translation: string;
    description: string;
  };
  onDetail(): void;
  onConfirm(translation: string, description: string): void;
};

export function WordItem({
  viewData,
  word,
  description,
  onDetail,
  onConfirm,
}: WordItemProps) {
  const { tr } = useTr();
  const theme = useTheme();

  const [translation, setTranslation] = useState<string>('');
  const [descriptionForTr, setDescriptionForTr] = useState<string>('');
  const [openForm, setOpenForm] = useState<boolean>(false);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (openForm) {
      if (translation.trim() !== '' && descriptionForTr.trim() !== '') {
        onConfirm(translation.trim(), descriptionForTr.trim());
      }

      setOpenForm(false);
    } else {
      onDetail();
    }

    e.stopPropagation();
    e.preventDefault();
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  let buttonIcon = <NavArrowRight sx={{ fontSize: 24 }} />;
  let sxObj = {
    border: `1px solid ${theme.palette.text.gray_stroke}`,
    borderRadius: '10px',
    background: 'default',
  };
  let iconBtnSxObj = {
    padding: '4px',
    border: `1px solid ${theme.palette.text.gray_stroke}`,
    borderRadius: '50%',
    background: '#fff',
    color: theme.palette.text.gray,
  };

  if (openForm || viewData) {
    buttonIcon = <Cancel sx={{ fontSize: 24 }} />;
    sxObj = {
      border: `1px solid ${theme.palette.text.blue}`,
      borderRadius: '10px 10px 0 0',
      background: theme.palette.text.blue,
    };
    iconBtnSxObj = {
      padding: '4px',
      border: `2px solid #F8F8F9`,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.10)',
      color: '#fff',
    };

    if (translation.trim() !== '' && descriptionForTr.trim() !== '') {
      buttonIcon = <Check sx={{ fontSize: 24 }} />;
      iconBtnSxObj = {
        padding: '4px',
        border: `2px solid #F8F8F9`,
        borderRadius: '50%',
        background: theme.palette.background.green,
        color: '#fff',
      };
    }
  }

  const formCom =
    openForm && !viewData ? (
      <Div
        sx={{
          border: `1px solid ${theme.palette.text.gray_stroke}`,
          borderTop: 'none',
          borderRadius: '0 0 10px 10px',
        }}
      >
        <InputBase
          value={translation}
          onChange={(e) => {
            setTranslation(e.currentTarget.value);
          }}
          multiline
          sx={{
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '22px',
            letterSpacing: '-0.28px',
            padding: '12px 16px',
            width: '100%',
            '& input': {
              padding: 0,
            },
          }}
          placeholder={tr('Your translation')}
        />
        <Divider />
        <InputBase
          value={descriptionForTr}
          onChange={(e) => {
            setDescriptionForTr(e.currentTarget.value);
          }}
          multiline
          sx={{
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '22px',
            letterSpacing: '-0.28px',
            padding: '12px 16px',
            width: '100%',
            '& input': {
              padding: 0,
            },
          }}
          placeholder={tr('Description')}
        />
      </Div>
    ) : null;

  const translationCom = viewData ? (
    <Div
      sx={{
        border: `1px solid ${theme.palette.text.gray_stroke}`,
        borderTop: 'none',
        borderRadius: '0 0 10px 10px',
      }}
    >
      <Typography variant="h3" sx={{ padding: '12px 16px' }}>
        {viewData.translation}
      </Typography>
      <Divider />
      <Typography variant="body1" sx={{ padding: '12px 16px' }}>
        {viewData.description}
      </Typography>
    </Div>
  ) : null;

  return (
    <Stack>
      <Div
        onClick={handleOpenForm}
        sx={{ position: 'relative', padding: '16px', ...sxObj }}
      >
        <Typography
          variant="h3"
          color={!openForm && !viewData ? 'text.dark' : 'text.white'}
        >
          {word}
        </Typography>
        <Typography
          variant="body2"
          color={!openForm && !viewData ? 'text.gray' : 'text.white'}
        >
          {description}
        </Typography>

        {!viewData ? (
          <IconButton
            onClick={handleClick}
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              ...iconBtnSxObj,
            }}
          >
            {buttonIcon}
          </IconButton>
        ) : null}
      </Div>
      {formCom}
      {translationCom}
    </Stack>
  );
}
