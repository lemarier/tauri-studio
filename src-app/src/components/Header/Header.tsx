import React, { FC, useMemo } from "react";

import { useProject } from "../../lib/project";
import { useTauriContext } from "../../lib/context";
import { ProjectState } from "../../lib/types";

const Header: FC = () => {
  const { project, addLog } = useTauriContext();
  const { build, run, stop } = useProject();

  const buttonMarkup = useMemo(() => {
    if (!project?.state) {
      return <></>;
    }

    switch (project.state) {
      case ProjectState.Ready:
        return (
          <button
            type="button"
            onClick={async (event) => {
              event.preventDefault();
              try {
                // we split that into 2 process so we can start building on
                // first init
                await build();
                await run();
              } catch (error) {
                if (error) {
                  addLog(error.toString());
                }
              }
            }}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-900 shadow-sm text-xs font-medium rounded-sm text-gray-700 bg-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Run project
          </button>
        );

      case ProjectState.Building:
        return (
          <button
            type="button"
            onClick={async () => {
              try {
                await stop();
              } catch (error) {
                addLog(error.toString());
              }
            }}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-900 shadow-sm text-xs font-medium rounded-sm text-gray-700 bg-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Cancel
          </button>
        );

      case ProjectState.Running:
        return (
          <button
            type="button"
            onClick={async () => {
              try {
                await stop();
              } catch (error) {
                addLog(error.toString());
              }
            }}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-900 shadow-sm text-xs font-medium rounded-sm text-gray-700 bg-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            Close
          </button>
        );

      default:
        return <>Wait...</>;
    }
  }, [run, project?.state, addLog, stop]);

  return (
    <div className="relative z-10 flex-shrink-0 flex h-12 p-2 border-b border-gray-700">
      {buttonMarkup}
    </div>
  );
};

export default Header;
