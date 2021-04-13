#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[macro_use]
extern crate include_dir;

mod cmd;
mod utils;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            cmd::generate_project,
            cmd::check_if_binary_is_available,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
