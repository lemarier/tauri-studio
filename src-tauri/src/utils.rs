use std::path::{Path, PathBuf};
use include_dir::Dir;
use tauri::{Result, Error};
use std::fs;
use std::fs::File;
use std::io::prelude::*;
use glob::glob;

fn copy_recursively(source: &Dir, destination: &PathBuf) -> Result<()> {
   for directory in source.dirs() {
      // create directory 
      let real_directory = destination.join(directory.path());
      fs::create_dir_all(real_directory)?;

      // create files if needed
      for bundled_file in directory.files() {
         let file_path = destination.join(bundled_file.path());
         if !file_path.exists() {
            let mut file = File::create(file_path.clone())?;
            println!("Created file at  {:?}", file_path.display());
            file.write_all(bundled_file.contents())?;
         }
      }

      // do it for all sub dir
      if directory.dirs.len() > 0 {
         copy_recursively(directory, destination)?;
      }
   }

   Ok(())
}

pub fn copy_bundled_project_local(destination: &PathBuf) -> Result<()> {
   // should be relative to the project root
   const PROJECT_DIR: Dir = include_dir!("../static");
   copy_recursively(&PROJECT_DIR, destination)?;
   Ok(())
}

pub fn find_file_in_path(source_path: PathBuf, file: &str) -> Result<Option<PathBuf>> {
   let join_path = source_path.join(Path::new(file));
   let path_glob = join_path.to_str().unwrap();

   // return first element
   for entry in glob(path_glob).unwrap() {
      if let Ok(path) = entry {
         return Ok(Some(path))
      }
  }

  Ok(None)
}

#[cfg(test)]
mod test {
   use super::*;
   use tempdir::TempDir;

   #[test]
   fn test_copy_bundled_project_local() {
      let dir = TempDir::new("tauri-builder").expect("Unable to create temp directory");
      copy_bundled_project_local(&dir.into_path()).expect("Unable to copy project files");
      // todo walkdir and make sur all files are created
   }
}

