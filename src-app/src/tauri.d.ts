declare module '@tauri-apps/api/tauri' {
  export const invoke: any;
}

declare module '@tauri-apps/api/fs' {
  export const readTextFile: any;
  export const writeFile: any;
  export const Dir: any;
}

declare module '@tauri-apps/api/shell' {
  export const Command: any;
  export type Child = any;
}
