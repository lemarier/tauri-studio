import {useCallback} from 'react';
import {readTextFile, writeFile, Dir} from '@tauri-apps/api/dist/fs';

import {Config} from './types';
import {useTauriContext} from './context';

const CONFIG_FILE_NAME = 'tauri-studio.conf';
const CONFIG_FILE_ROOT = Dir.LocalData;

export const useSettings = () => {
  const {setConfig, config} = useTauriContext();

  const initializeConfig = useCallback(async () => {
    try {
      const config = await readTextFile(CONFIG_FILE_NAME, {
        dir: CONFIG_FILE_ROOT,
      });
      // update local state
      setConfig(JSON.parse(config) as Config);
    } catch (error) {
      // maybe the file didnt exist, lets try to
      // create it and return a blank config instance
      await writeFile(
        {contents: '{}', path: CONFIG_FILE_NAME},
        {dir: CONFIG_FILE_ROOT},
      );
      setConfig({} as Config);
    }
  }, [setConfig]);

  const saveConfig = useCallback(
    (newConfig: Partial<Config>) => {
      if (config) {
        setConfig({...config, ...newConfig});
      } else {
        setConfig(newConfig);
      }

      return writeFile(
        {contents: JSON.stringify(config), path: CONFIG_FILE_NAME},
        {dir: CONFIG_FILE_ROOT},
      );
    },
    [setConfig, config],
  );

  return {
    initializeConfig,
    saveConfig,
  };
};
