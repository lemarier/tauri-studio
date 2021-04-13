import {FC} from 'react';

const Tabs: FC = () => {
  return (
    <div>
      <nav className="ml-2 mb-2 flex space-x-8" aria-label="Tabs">
        <button
          type="button"
          onClick={() => {}}
          className="border-gray-500 text-gray-300 group inline-flex items-center py-4 px-1 border-b-4 font-medium text-sm focus:outline-none"
        >
          <svg
            className="text-red-700 -ml-0.5 mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <text x="0" y="15">
              RS
            </text>
          </svg>
          <span>tauri.rs</span>
        </button>

        <button
          type="button"
          onClick={() => {}}
          className="order-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 group inline-flex items-center py-4 px-1 border-b-4 font-medium text-sm focus:outline-none"
        >
          <svg
            className="text-yellow-300 -ml-0.5 mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <text x="0" y="15">
              JS
            </text>
          </svg>
          <span>app.js</span>
        </button>
      </nav>
    </div>
  );
};

export default Tabs;
