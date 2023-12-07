import { useEffect, useState, useCallback } from 'react';

import packageJson from '../../../package.json';
const appVersion = packageJson.version;

const semverGreaterThan = (versionA: string, versionB: string) => {
  const versionsA = versionA.split(/\./g);

  const versionsB = versionB.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());

    const b = Number(versionsB.shift());
    // eslint-disable-next-line no-continue
    if (a === b) continue;
    // eslint-disable-next-line no-restricted-globals
    return a > b || isNaN(b);
  }
  return false;
};

export const useCacheBuster = () => {
  const [state, setState] = useState<{
    loading: boolean;
    isLatestVersion: boolean;
    latestVersion: string;
  }>({
    loading: true,
    isLatestVersion: false,
    latestVersion: '',
  });

  const refreshCacheAndReload = useCallback(async (version: string) => {
    try {
      if (caches) {
        // Service worker cache should be cleared with caches.delete()
        caches.keys().then(function (names) {
          for (const name of names) caches.delete(name);
        });
      }
      localStorage.clear();
      localStorage.setItem('APP_VERSION', version);

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetch('/meta.json')
      .then((response) => {
        try {
          return response.json();
        } catch (error) {
          console.error(error);
          return { version: '' };
        }
      })
      .then((meta) => {
        const latestVersion = meta.version;
        const currentVersion = appVersion;
        const localStorageAppVersion = localStorage.getItem('APP_VERSION');

        const shouldForceRefresh = semverGreaterThan(
          latestVersion,
          currentVersion,
        );

        let invalidPersistedData = false;
        if (
          !localStorageAppVersion ||
          semverGreaterThan(latestVersion, localStorageAppVersion as string)
        ) {
          invalidPersistedData = true;
        }
        if (shouldForceRefresh || invalidPersistedData) {
          if (shouldForceRefresh)
            console.info(
              'info:::: ',
              `We have a new version - ${latestVersion}. Should force refresh`,
            );
          if (invalidPersistedData)
            console.info(
              'info:::: ',
              `You have invalid persisted data - ${latestVersion}. Should force refresh`,
            );
          console.error(
            `We have a new version - ${latestVersion}. Should force refresh`,
          );
          setState({ loading: false, isLatestVersion: false, latestVersion });
        } else {
          console.info(
            'info:::: ',
            `You already have the latest version - ${latestVersion}. No cache refresh needed.`,
          );
          console.error(
            `You already have the latest version - ${latestVersion}. No cache refresh needed.`,
          );
          setState({ loading: false, isLatestVersion: true, latestVersion });
        }
      });
  }, []);
  return {
    loading: state.loading,
    isLatestVersion: state.isLatestVersion,
    latestVersion: state.latestVersion,
    refreshCacheAndReload,
  };
};
