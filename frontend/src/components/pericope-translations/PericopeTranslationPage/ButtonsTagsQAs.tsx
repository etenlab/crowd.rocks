import { Button, Stack } from '@mui/material';
import { useTr } from '../../../hooks/useTr';
import { QAIcon } from '../../common/icons/QAIcon';
import { TagIcon } from '../../common/icons/TagIcon';

type ButtonsTagsQAsProps = {
  tagsCount: number;
  qasCount: number;
  onTagsClick?: () => void;
  onQAsClick?: () => void;
};
export function ButtonsTagsQAs({
  tagsCount,
  qasCount,
  onQAsClick = () => {},
  onTagsClick = () => {},
}: ButtonsTagsQAsProps) {
  const { tr } = useTr();
  return (
    <Stack display={'flex'} flexDirection={'row'} gap={'14px'}>
      <Button
        variant="outlined"
        onClick={() => onTagsClick()}
        fullWidth
        sx={(theme) => ({
          color: theme.palette.text.dark,
          border: `1px solid ${theme.palette.text.gray_stroke}`,
        })}
      >
        <TagIcon sx={{ marginRight: '10px' }} />
        {tr('Tags')} ({tagsCount})
      </Button>
      <Button
        variant="outlined"
        onClick={() => onQAsClick()}
        fullWidth
        sx={(theme) => ({
          color: theme.palette.text.dark,
          border: `1px solid ${theme.palette.text.gray_stroke}`,
        })}
      >
        <QAIcon sx={{ marginRight: '10px' }} />
        {tr('Q&A')} ({qasCount})
      </Button>
    </Stack>
  );
}
