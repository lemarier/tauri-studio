import {FC, useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/router';

import {Requirement} from '../../lib/types';
import {useSetup} from '../../lib/setup';
import {useSettings} from '../../lib/settings';
import {useTauriContext} from '../../lib/context';

const ALL_REQUIREMENTS: Requirement[] = [
  {
    name: 'Rust',
    binaryName: 'cargo',
    installLinux: 'https://sh.rustup.rs',
    installMacos: 'https://sh.rustup.rs',
    installWindows: 'https://win.rustup.rs/x86_64',
  },
];

const PendingVerification = ({requirement}: {requirement: Requirement}) => {
  return (
    <li>
      <div className="relative pb-8">
        <div className="relative flex space-x-3">
          <div>
            <span className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center ring-8 ring-gray-300">
              <svg
                className="h-5 w-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
            <div>
              <p className="text-md text-gray-500 pl-4">
                Checking if {requirement.name} is installed...
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const InstalledSuccessfully = ({requirement}: {requirement: Requirement}) => {
  return (
    <li>
      <div className="relative pb-8">
        <div className="relative flex space-x-3">
          <div>
            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-gray-300">
              <svg
                className="h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
            <div>
              <p className="text-md text-gray-500 pl-4">
                {requirement.name} is installed successfully...
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const RequireInstallation = ({requirement}: {requirement: Requirement}) => {
  return (
    <li>
      <div className="relative pb-8">
        <div className="relative flex space-x-3">
          <div>
            <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
            <div>
              <p className="text-md text-gray-500 pl-4">
                {requirement.name} is not installed and is required.
              </p>
            </div>
            <div className="text-right text-sm whitespace-nowrap text-gray-500">
              Install
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const SetupElement = ({requirement}: {requirement: Requirement}) => {
  const {whichBinary} = useSetup();
  const {saveConfig} = useSettings();

  const [installed, setInstalled] = useState<undefined | boolean>(undefined);

  useEffect(() => {
    const fn = async () => {
      try {
        const path = await whichBinary(requirement.binaryName);
        if (path) {
          setInstalled(true);
          if (requirement.binaryName === 'cargo') {
            await saveConfig({cargoPath: path});
          }
        } else {
          setInstalled(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log({error});
        setInstalled(false);
      }
    };

    fn();
  }, [whichBinary, requirement.binaryName, setInstalled, saveConfig]);

  const markup = useMemo(() => {
    if (installed) {
      return <InstalledSuccessfully requirement={requirement} />;
    }

    if (installed === undefined) {
      return <PendingVerification requirement={requirement} />;
    }

    return <RequireInstallation requirement={requirement} />;
  }, [requirement, installed]);

  return markup;
};

const SetupFeed: FC = () => {
  const {config} = useTauriContext();
  const router = useRouter();

  // compile our dependencies and make sure
  // we have all binary inside our config file
  const isReady = useMemo(() => {
    if (config && config.cargoPath) {
      return true;
    }
    return false;
  }, [config]);

  useEffect(() => {
    if (isReady) {
      router.push('/editors');
    }
  }, [isReady, router]);

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {ALL_REQUIREMENTS.map((requirement, id) => {
          const requirementKey = `r_${id}`;
          return (
            <SetupElement key={requirementKey} requirement={requirement} />
          );
        })}
      </ul>
    </div>
  );
};

export default SetupFeed;
