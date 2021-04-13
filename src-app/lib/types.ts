export type EditorId = 'rust' | 'html';

// for now let show only 2 editor
// to keep it simple we can change this easilly later
export interface EditorValues {
  rust: string;
  html: string;
}

export enum ProjectState {
  // newly created
  Pending = 'pending',
  // cargo build
  Building = 'building',
  // ready to be run
  Ready = 'ready',
  // already running
  Running = 'running',
  // exporting
  Exporting = 'exporting',
}

export enum EditorLanguage {
  Rust = 'rust',
  Javascript = 'javascript',
  Html = 'html',
}

export interface TauriProject {
  state: ProjectState;
  tauriConfPath: string;
  exportedUrl: string | undefined;
  localPath: string;
  mainHtmlFile: string;
  mainTauriFile: string;
  mainCargoFile: string;
  editors: EditorValues;
}

export interface Requirement {
  name: string;
  binaryName: string;
  installWindows: string;
  installMacos: string;
  installLinux: string;
}

export interface Config {
  cargoPath: string;
}
