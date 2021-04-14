import { useCallback, useState } from "react";
// @ts-ignore
import { invoke } from "@tauri-apps/api/tauri";
// @ts-ignore
import { readTextFile, writeFile } from "@tauri-apps/api/fs";
// @ts-ignore
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
    if (!project) {
      return;
    }

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
      if (!config || !project) {
        return;
      }
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

      command.on("error", (error: Error) => {
        addLog(error.toString());
        setProjectState(ProjectState.Ready);
        return reject();
      });

      command.stdout.on("data", (line: string) => {
        addLog(line);
      });

      command.stderr.on("data", (line: string) => {
        addLog(line);
      });

      command
        .spawn()
        .then((child: Child) => {
          setChild(child);
        })
        .catch((error: Error) => {
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
