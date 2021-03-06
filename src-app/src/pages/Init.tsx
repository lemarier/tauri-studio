import React, {useEffect, useMemo} from 'react';

import {SetupFeed} from '../components';
import {useTauriContext} from '../lib/context';
import {AppView} from '../lib/types';

const InitPage = () => {
  const {config, setView, addLog} = useTauriContext();

  // compile our dependencies and make sure
  // we have all binary inside our config file
  const isReady = useMemo(() => {
    // eslint-disable-next-line no-console
    console.log({config});
    if (config && config.cargoPath && config.npxPath) {
      return true;
    }
    return false;
  }, [config]);

  useEffect(() => {
    if (isReady && config) {
      // switch to editors view
      addLog(`npx: ${config.npxPath}`);
      addLog(`cargo: ${config.cargoPath}`);
      setView(AppView.Editors);
    }
  }, [isReady, config, addLog, setView]);

  return (
    <div className="flex h-screen">
      <div className="m-auto text-center border border-gray-700 rounded">
        <div className="bg-gray-700 px-2 py-3">
          <h3 className="text-lg leading-6 font-medium text-gray-500">
            Initializing Tauri Studio
          </h3>
        </div>
        <div className="p-8">
          <SetupFeed />
        </div>
      </div>
    </div>
  );
};

export default InitPage;
