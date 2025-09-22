/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAPIDAPI_HOST: string
  readonly VITE_RAPIDAPI_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
