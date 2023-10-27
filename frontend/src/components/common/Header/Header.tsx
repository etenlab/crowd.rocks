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
import { Cancel } from '../icons/Cancel';

import { Avatar } from '../Avatar';
import { globals } from '../../../services/globals';
import { SunLight } from '../icons/SunLight';
import { HalfMoon } from '../icons/HalfMoon';

export type HeaderProps = {
  onClickMenu(): void;
  onClickAppName(): void;
  onClickDiscussion(): void;
  onClickNotification(): void;
  onClickThemeButton(): void;
  onCancel(): void;
  notificationCount: number;
  isMenuHeader?: boolean;
  themeMode: 'dark' | 'light';
};

export function Header({
  onClickMenu,
  onClickAppName,
  onClickDiscussion,
  onClickNotification,
  onClickThemeButton,
  onCancel,
  notificationCount,
  isMenuHeader,
  themeMode,
}: HeaderProps) {
  const { tr } = useTr();

  const title = tr('crowd.rocks').split('.');

  const username = globals.get_avatar();

  const iconsCom = (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      gap="8px"
    >
      {!isMenuHeader ? (
        <>
          <IconButton onClick={onClickDiscussion} sx={{ display: 'none' }}>
            <ChatBubbleEmpty sx={{ fontSize: 24 }} color="dark" />
          </IconButton>
          <IconButton
            onClick={onClickNotification}
            sx={{ position: 'relative', display: 'none' }}
          >
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
          <IconButton
            onClick={onClickThemeButton}
            sx={{ position: 'relative' }}
          >
            {themeMode === 'light' ? (
              <SunLight sx={{ fontSize: 24 }} color="dark" />
            ) : (
              <HalfMoon sx={{ fontSize: 24 }} color="dark" />
            )}
          </IconButton>
        </>
      ) : (
        <IconButton onClick={onCancel}>
          <Cancel sx={{ fontSize: 30 }} color="dark" />
        </IconButton>
      )}
    </Stack>
  );
  const headerCom = !isMenuHeader ? (
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
  ) : null;

  return (
    <Box
      sx={{
        width: '100%',
        background: (theme) => theme.palette.background.white,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={(theme) => ({
          padding: '8px',
          borderBottom: '1px solid #DEE0E8',
          maxWidth: '777px',
          margin: 'auto',
          backgroundColor: theme.palette.text.white,
        })}
      >
        <IconButton onClick={onClickMenu} id="app-menu-button">
          {username ? (
            <Avatar username={username} mini={false} />
          ) : (
            <MuiAvatar sx={{ width: '46px', height: '46px' }} />
          )}
        </IconButton>
        {headerCom}
        {iconsCom}
      </Stack>
    </Box>
  );
}
