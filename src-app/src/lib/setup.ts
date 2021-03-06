import {useCallback} from 'react';
// @ts-nocheck
import {invoke} from '@tauri-apps/api/tauri';

export const useSetup = () => {
  const whichBinary = useCallback(async (binary: string) => {
    const binaryPath = await invoke<string | null>(
      'check_if_binary_is_available',
      {
        binary,
      },
    );
    return binaryPath;
  }, []);

  return {
    whichBinary,
  };
};
