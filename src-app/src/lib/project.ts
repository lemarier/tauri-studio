import {useCallback, useState} from 'react';

import {Command, Child} from '@tauri-apps/api/shell';
import {invoke,} from '@tauri-apps/api';
import {
  readTextFile,
  writeFile,
} from '@tauri-apps/api/fs';

import {useTauriContext} from './context';
import {TauriProject, ProjectState} from './types';

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
    const project = await invoke<TauriProject>('generate_project');
    const html = await readTextFile(project.mainHtmlFile);
    const rust = await readTextFile(project.mainTauriFile);

    const finalProject = {
      ...project,
      state: ProjectState.Ready,
      editors: {html, rust},
    };

    setProject(finalProject);
    return finalProject;
  }, [setProject]);

  const run = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (!config?.cargoPath || !project) {
        return;
      }

      addLog('Running project');

      // mark the project as running
      setProjectState(ProjectState.Running);

      const command = new Command(config.cargoPath, [
        'run',
        '--manifest-path',
        project.mainCargoFile,
      ]);

      command.on('close', () => {
        addLog('App closed');
        setProjectState(ProjectState.Ready);
        return resolve();
      });

      command.on('error', (error: Error) => {
        addLog(error.toString());
        setProjectState(ProjectState.Ready);
        return reject();
      });

      command.stdout.on('data', (line: string) => {
        addLog(line);
      });

      command.stderr.on('data', (line: string) => {
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

  const build = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (!config?.cargoPath || !project) {
        return;
      }

      addLog('Building project');

      // mark the project as running
      setProjectState(ProjectState.Building);

      const command = new Command(config.cargoPath, [
        'build',
        '--manifest-path',
        project.mainCargoFile,
      ]);

      command.on('close', ({signal = 0}: {signal: number}) => {
        setProjectState(ProjectState.Ready);

        // SIGKILL
        // closed manually
        if (signal === 9) {
          return reject(new Error('Build cancelled'));
        }

        return resolve();
      });

      command.on('error', (error: Error) => {
        addLog(error.toString());
        setProjectState(ProjectState.Ready);
        return reject();
      });

      command.stdout.on('data', (line: string) => {
        addLog(line);
      });

      command.stderr.on('data', (line: string) => {
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
    build,
    run,
    stop,
    saveEditorValuesOnDisk,
    loadBundledProject,
  };
};
