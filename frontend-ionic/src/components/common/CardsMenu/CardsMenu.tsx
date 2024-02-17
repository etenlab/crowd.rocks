import { ReactNode } from 'react';
import { useHistory } from 'react-router';
import {
  List,
  ListItem,
  Button,
  Typography,
  ListSubheader,
  Stack,
} from '@mui/material';

export type CardsMenuItemType = {
  link: string;
  icon: ReactNode;
  title: string;
  description: string;
  isShown(): boolean;
};

type CardsMenuItemProps = {
  item: CardsMenuItemType;
};

export function CardsMenuItem({ item }: CardsMenuItemProps) {
  const { link, icon, title, description, isShown } = item;
  const history = useHistory();

  const handleGoTo = () => {
    history.push(link);
  };

  if (!isShown()) {
    return null;
  }

  return (
    <ListItem sx={{ padding: '6px 0px' }}>
      <Button
        variant="outlined"
        onClick={handleGoTo}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          padding: '14px 12px',
          paddingLeft: '24px',
          gap: '10px',
          width: '100%',
          borderColor: (theme) => theme.palette.background.gray_stroke,
          borderRadius: '10px',
          backgroundColor: (theme) => theme.palette.background.blue_10,
          textTransform: 'none',
          textAlign: 'start',
        }}
      >
        {icon}
        <Stack
          gap="5px"
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Typography
            variant="subtitle1"
            color="text.dark"
            sx={{ display: 'inline-block' }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline-block' }}>
            {description}
          </Typography>
        </Stack>
      </Button>
    </ListItem>
  );
}

type CardsMenuProps = {
  label: string;
  items: CardsMenuItemType[];
  marginTop?: string;
};

export function CardsMenu({ label, items, marginTop = '0' }: CardsMenuProps) {
  return (
    <List
      component="nav"
      sx={{ padding: '0' }}
      subheader={
        <ListSubheader
          component="div"
          sx={{
            padding: '6px 0px',
            margin: `${marginTop} 0 0 0 `,
            backgroundColor: (theme) => theme.palette.background.white,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="overline" sx={{ opacity: 0.5 }}>
              {label}
            </Typography>
          </Stack>
        </ListSubheader>
      }
    >
      {items.map((item) => (
        <CardsMenuItem item={item} key={item.title} />
      ))}
    </List>
  );
}
