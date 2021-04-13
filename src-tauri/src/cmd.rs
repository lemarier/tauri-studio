use std::path::PathBuf;
use tauri::command;
use tempdir::TempDir;
use serde::Serialize;
use which::which;
use crate::utils::{copy_bundled_project_local, find_file_in_path};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TauriProject {
   state: String,
   local_path: PathBuf,
   tauri_conf_path: PathBuf,
   main_html_file: PathBuf,
   main_tauri_file: PathBuf,
   main_cargo_file: PathBuf,
}

#[command]
pub fn generate_project(gist: Option<String>) -> TauriProject {
   let local_path = TempDir::new("tauri-builder").expect("Unable to create temp directory").into_path();

   // download remote gist and push it
   // copy bundled project local
   // overwrite with gist files
   // this way gist dont require icons or other files to run
   if gist.is_some() {
   } else {
      copy_bundled_project_local(&local_path).expect("Unable to copy project locally");
   }

   // todo better error handling
   let tauri_conf_path = find_file_in_path(local_path.clone(), "**/tauri.conf.json").expect("Unable to get tauri.conf.json").unwrap();
   let main_html_file = find_file_in_path(local_path.clone(), "**/index.html").expect("Unable to get index.html").unwrap();
   let main_tauri_file = find_file_in_path(local_path.clone(), "**/main.rs").expect("Unable to get main.rs").unwrap();
   let main_cargo_file = find_file_in_path(local_path.clone(), "**/Cargo.toml").expect("Unable to get cargo.toml").unwrap();
   
   TauriProject {
      state: "pending".into(),
      local_path,
      tauri_conf_path,
      main_html_file,
      main_tauri_file,
      main_cargo_file
   }
}

#[command]
pub fn check_if_binary_is_available(binary: String) -> Option<PathBuf> {
   if let Ok(result) = which(binary) {
      return Some(result);
   }

   None
}