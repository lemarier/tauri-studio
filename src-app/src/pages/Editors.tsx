import React, {useEffect, useMemo} from 'react';
import SplitPane from 'react-split-pane';

import {Header, Terminal, Editors} from '../components';
import {useTauriContext} from '../lib/context';
import {useProject} from '../lib/project';
import {useSettings} from '../lib/settings';

const EditorsPage = () => {
  const {project, addLog} = useTauriContext();
  const {loadBundledProject} = useProject();
  const {initializeConfig} = useSettings();

  // make sure our config got initialized on first render
  // in development, we may got a quick reload and skip the index
  // we should initialize config here as well
  useEffect(() => {
    initializeConfig();
  }, [initializeConfig]);

  useEffect(() => {
    const fn = async () => {
      try {
        const project = await loadBundledProject();
        addLog(`Loaded project from: ${project.localPath}`);
      } catch (error) {
        addLog(error.toString());
      }
    };
    fn();
  }, [addLog, loadBundledProject]);

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header />
        <div className="relative h-full">
          <SplitPane
            minSize={150}
            maxSize={400}
            split="horizontal"
            defaultSize={200}
            primary="second"
          >
            <Editors editors={project?.editors} />
            <Terminal />
          </SplitPane>
        </div>
      </div>
    </div>
  );
};

export default EditorsPage;
