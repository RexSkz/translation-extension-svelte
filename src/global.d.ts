/// <reference types="svelte" />

interface Word {
  模块: string;
  中文: string;
  英文: string;
  备注: string;
}

declare module '*.csv' {
  const parsed: Word[] = [];
  export default parsed;
}
