/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// SQL file imports (via sqlLoader plugin)
declare module '*.sql' {
  const content: string;
  export default content;
}

// ArrayBuffer imports (via vite-plugin-arraybuffer)
declare module '*?arraybuffer' {
  const content: ArrayBuffer;
  export default content;
}
