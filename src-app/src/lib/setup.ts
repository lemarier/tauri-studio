import {useCallback} from 'react';

import {invoke} from '../../node_modules/@tauri-apps/api/dist/tauri';

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
