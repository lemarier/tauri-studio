import { useCallback, useState } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import { Command, Child } from "@tauri-apps/api/shell";

import { useTauriContext } from "./context";
import { TauriProject, ProjectState } from "./types";

export const useProject = () => {
  const [child, setChild] = useState<Child | undefined>();
  const {
    setProject,
    project,
    addLog,
    setProjectState,
    config,
  } = useTauriContext();

  const saveEditorValuesOnDisk = useCallback(async () => {
    // we got out project path
    await writeFile({
      path: project.mainHtmlFile,
      contents: project.editors.html,
    });

    await writeFile({
      path: project.mainTauriFile,
      contents: project.editors.rust,
    });
  }, [project]);

  const loadBundledProject = useCallback(async () => {
    const project = await invoke<TauriProject>("generate_project");
    const html = await readTextFile(project.mainHtmlFile);
    const rust = await readTextFile(project.mainTauriFile);

    const finalProject = {
      ...project,
      state: ProjectState.Ready,
      editors: { html, rust },
    };

    setProject(finalProject);
    return finalProject;
  }, [setProject]);

  const run = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // mark the project as running
      setProjectState(ProjectState.Running);

      const command = new Command(config.cargoPath, [
        "run",
        "--release",
        "--manifest-path",
        project.mainCargoFile,
      ]);

      command.on("close", () => {
        setProjectState(ProjectState.Ready);
        addLog("App closed");
        resolve();
      });

      command.on("error", (error) => {
        addLog(error.toString());
        setProjectState(ProjectState.Ready);
        return reject();
      });

      command.stdout.on("data", (line) => {
        addLog(line);
      });

      command.stderr.on("data", (line) => {
        addLog(line);
      });

      command
        .spawn()
        .then((pid) => {
          setChild(pid);
        })
        .catch((error) => {
          reject(error.toString());
        });
    });
  }, [addLog, setChild, project, setProjectState, config?.cargoPath]);

  const stop = useCallback(async () => {
    if (child) {
      await child.kill();
    }
    setProjectState(ProjectState.Ready);
  }, [child, setProjectState]);

  return {
    run,
    stop,
    saveEditorValuesOnDisk,
    loadBundledProject,
  };
};
