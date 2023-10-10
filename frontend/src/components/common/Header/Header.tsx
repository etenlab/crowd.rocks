import { Stack, Avatar, IconButton, Button, Badge } from '@mui/material';

import { useTr } from '../../../hooks/useTr';
import { AppNotification } from '../icons/AppNotification';
import { ChatBubbleEmpty } from '../icons/ChatBubbleEmpty';

export type HeaderProps = {
  onClickMenu(): void;
  onClickAppName(): void;
  onClickDiscussion(): void;
  onClickNotification(): void;
  notificationCount: number;
};

export function Header({
  onClickMenu,
  onClickAppName,
  onClickDiscussion,
  onClickNotification,
  notificationCount,
}: HeaderProps) {
  const { tr } = useTr();

  const title = tr('crowd.rocks').split('.');

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ padding: '8px', borderBottom: '1px solid #DEE0E8' }}
    >
      <IconButton onClick={onClickMenu}>
        <Avatar sx={{ width: '46px', height: '46px' }}>H</Avatar>
      </IconButton>

      <Button
        variant="text"
        onClick={onClickAppName}
        sx={{
          color: '#181818',
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: '22px',
          letterSpacing: '-0.36px',
        }}
      >
        {title[0]}.<span style={{ color: '#476FFF' }}>{title[1]}</span>
      </Button>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        gap="8px"
      >
        <IconButton onClick={onClickDiscussion}>
          <ChatBubbleEmpty sx={{ fontSize: 24 }} color="dark" />
        </IconButton>
        <IconButton onClick={onClickNotification} sx={{ position: 'relative' }}>
          <Badge
            badgeContent={notificationCount}
            color="red"
            variant="dot"
            sx={{
              position: 'absolute',
              top: '13px',
              right: '13px',
              '& .MuiBadge-badge': {
                width: '10px',
                height: '10px',
              },
            }}
          ></Badge>
          <AppNotification sx={{ fontSize: 24 }} color="dark" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
