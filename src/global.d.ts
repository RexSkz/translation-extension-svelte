/// <reference types="svelte" />

interface Word {
  src: string;
  zh: string;
  en: string;
  desc: string;
}

declare module '*.csv' {
  const parsed: Word[] = [];
  export default parsed;
}

declare module '*.png';
