/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_SERVER_URL: string;
  readonly VITE_APP_WS_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
