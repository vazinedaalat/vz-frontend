/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ASSET_BASE_URL: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
  readonly VITE_APP_NAME: string
  readonly VITE_USE_MOCK: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
