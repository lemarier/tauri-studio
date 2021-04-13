import {FC, useEffect} from 'react';

import {SetupFeed} from '../components';
import {useSettings} from '../lib/settings';

const HomePage: FC = () => {
  const {initializeConfig} = useSettings();

  // make sure our config got initialized on first render
  useEffect(() => {
    initializeConfig();
  }, [initializeConfig]);

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

export default HomePage;
