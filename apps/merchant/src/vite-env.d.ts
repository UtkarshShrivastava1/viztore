/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly NEXT_PUBLIC_APP_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
