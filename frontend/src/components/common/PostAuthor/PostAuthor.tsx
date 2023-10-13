import { Stack, Typography, Box } from '@mui/material';

import { Avatar } from '../Avatar';
import { DateViewer } from '../DateViewer';

export type PostAuthorProps = {
  avatar?: string;
  username: string;
  date: Date;
};

export function PostAuthor({ avatar, username, date }: PostAuthorProps) {
  const transformUsername = `@${username}`;

  return (
    <Stack direction="row" gap="10px" alignItems="center">
      <Avatar username={username} url={avatar} mini={true} />
      <Typography variant="h3">{transformUsername}</Typography>

      <Box
        sx={{
          width: '2px',
          height: '2px',
          background: (theme) => theme.palette.text.gray,
          borderRadius: '50%',
        }}
      />
      <DateViewer date={date} />
    </Stack>
  );
}
