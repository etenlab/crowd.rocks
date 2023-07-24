import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'rocks.crowd',
  appName: 'frontend',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
