import { useCallback } from "react";

import { invoke } from "@tauri-apps/api/tauri";

export const useSetup = () => {
  const whichBinary = useCallback(async (binary: string) => {
    const binaryPath: string = await invoke<string | null>(
      "check_if_binary_is_available",
      {
        binary,
      }
    );
    return binaryPath;
  }, []);

  return {
    whichBinary,
  };
};
