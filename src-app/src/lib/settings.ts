import { useCallback } from "react";
// @ts-ignore
import { readTextFile, writeFile, Dir } from "@tauri-apps/api/fs";

import { Config } from "./types";
import { useTauriContext } from "./context";

const CONFIG_FILE_NAME = "tauri-studio.conf";
const CONFIG_FILE_ROOT = Dir.LocalData;

export const useSettings = () => {
  const { setConfig } = useTauriContext();

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
        { contents: "{}", path: CONFIG_FILE_NAME },
        { dir: CONFIG_FILE_ROOT }
      );
      setConfig({} as Config);
    }
  }, [setConfig]);

  const saveConfig = useCallback(
    (config: Config) => {
      // update local state
      setConfig(config);

      return writeFile(
        { contents: JSON.stringify(config), path: CONFIG_FILE_NAME },
        { dir: CONFIG_FILE_ROOT }
      );
    },
    [setConfig]
  );

  return {
    initializeConfig,
    saveConfig,
  };
};
