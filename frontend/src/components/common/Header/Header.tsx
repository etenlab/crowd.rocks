import {
  Stack,
  IconButton,
  Box,
  Button,
  Badge,
  Avatar as MuiAvatar,
} from '@mui/material';

import { useTr } from '../../../hooks/useTr';

import { AppNotification } from '../icons/AppNotification';
import { ChatBubbleEmpty } from '../icons/ChatBubbleEmpty';

import { Avatar } from '../Avatar';
import { globals } from '../../../services/globals';

export type HeaderProps = {
  onClickMenu(): void;
  onClickAppName(): void;
  onClickDiscussion(): void;
  onClickNotification(): void;
  notificationCount: number;
  isMenuHeader?: boolean;
};

export function Header({
  onClickMenu,
  onClickAppName,
  onClickDiscussion,
  onClickNotification,
  notificationCount,
  isMenuHeader,
}: HeaderProps) {
  const { tr } = useTr();

  const title = tr('crowd.rocks').split('.');

  const username = globals.get_avatar();

  const avatarCom = !isMenuHeader ? (
    <IconButton onClick={onClickMenu} id="app-menu-button">
      {username ? (
        <Avatar username={username} mini={false} />
      ) : (
        <MuiAvatar sx={{ width: '46px', height: '46px' }} />
      )}
    </IconButton>
  ) : null;
  const iconsCom = !isMenuHeader ? (
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
  ) : null;

  const padding = !isMenuHeader ? '8px' : '18px';
  const justify = !isMenuHeader ? 'space-between' : 'center';

  return (
    <Box
      sx={{
        width: '100%',
        background: (theme) => theme.palette.background.white,
      }}
    >
      <Stack
        direction="row"
        justifyContent={justify}
        alignItems="center"
        sx={(theme) => ({
          padding,
          borderBottom: '1px solid #DEE0E8',
          maxWidth: '777px',
          margin: 'auto',
          backgroundColor: theme.palette.text.white,
        })}
      >
        {avatarCom}
        <Button
          id="app-name-text"
          variant="text"
          onClick={onClickAppName}
          sx={(theme) => ({
            color: theme.palette.text.dark,
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: '22px',
            letterSpacing: '-0.36px',
          })}
        >
          {title[0]}.<span style={{ color: '#476FFF' }}>{title[1]}</span>
        </Button>
        {iconsCom}
      </Stack>
    </Box>
  );
}
