import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useIonViewWillEnter } from '@ionic/react';

import { PageLayout } from '../common/PageLayout';
import { useTr } from '../../hooks/useTr';
import { ISettings, globals } from '../../services/globals';

import { Caption } from '../common/Caption/Caption';
import { Switch } from '../common/buttons/Switch';

import { SettingList } from '../common/list/SettingList';

import { useColorModeContext } from '../../theme';

export function SettingsPage() {
  const { tr } = useTr();
  const history = useHistory();
  const { nation_id, language_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();
  const { setColorMode } = useColorModeContext();

  const [show_dark_mode, set_show_dark_mode] = useState(false);
  const [toolsState, setToolsState] = useState<ISettings>({
    isBetaTools: false,
    isOral: false,
    isSign: false,
  });

  useEffect(() => {
    const settings = globals.get_settings();
    setToolsState(settings);
  }, []);

  useEffect(() => {
    globals.set_settings(toolsState);
  }, [toolsState]);

  const set_theme_classes = (is_dark: boolean) => {
    document.documentElement.classList.toggle('dark', is_dark);
    document.documentElement.classList.toggle('light', !is_dark);
  };

  useIonViewWillEnter(() => {
    const theme_storage = localStorage.getItem('theme');
    switch (theme_storage) {
      case null:
        set_show_dark_mode(false);
        localStorage.setItem('theme', 'light');
        setColorMode('light');
        set_theme_classes(false);
        break;
      case 'light':
        set_show_dark_mode(false);
        set_theme_classes(false);
        setColorMode('light');
        break;
      case 'dark':
        set_show_dark_mode(true);
        set_theme_classes(true);
        setColorMode('dark');
        break;
      default:
        set_show_dark_mode(false);
        set_theme_classes(false);
        setColorMode('light');
    }
  });

  const toggle_theme = (checked: boolean) => {
    set_show_dark_mode(checked);
    if (!checked) {
      localStorage.setItem('theme', 'light');
      setColorMode('light');
    } else {
      localStorage.setItem('theme', 'dark');
      setColorMode('dark');
    }
    set_theme_classes(checked);
  };

  const toggleIsBetaTools = useCallback(() => {
    setToolsState({
      ...toolsState,
      isBetaTools: !toolsState.isBetaTools,
    });
  }, [toolsState]);

  const toggleIsOral = useCallback(() => {
    setToolsState({
      ...toolsState,
      isBetaTools: !toolsState.isBetaTools,
    });
  }, [toolsState]);

  const toggleIsSign = useCallback(() => {
    setToolsState({
      ...toolsState,
      isSign: !toolsState.isSign,
    });
  }, [toolsState]);

  const toolItems = [
    {
      title: tr('Beta Tools'),
      endIcon: <Switch checked={toolsState.isBetaTools} />,
      onClick: toggleIsBetaTools,
    },
    {
      title: tr('Oral Tools'),
      endIcon: <Switch checked={toolsState.isOral} />,
      onClick: toggleIsOral,
    },
    {
      title: tr('Sign Tools'),
      endIcon: <Switch checked={toolsState.isSign} />,
      onClick: toggleIsSign,
    },
  ];

  const designItems = [
    {
      title: tr('Dark Mode'),
      endIcon: <Switch checked={show_dark_mode} />,
      onClick: () => {
        toggle_theme(!show_dark_mode);
      },
    },
  ];

  return (
    <PageLayout>
      <Caption
        handleBackClick={() => {
          history.push(`/${nation_id}/${language_id}/1/home`);
        }}
      >
        {tr('Settings')}
      </Caption>

      <SettingList items={toolItems} title={tr('Tools')} />
      <SettingList items={designItems} title={tr('Design Mode')} />
    </PageLayout>
  );
}
