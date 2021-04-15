import React, {FC, useCallback, useEffect, useRef} from 'react';

import {useTauriContext} from '../../lib/context';

const Terminal: FC = () => {
  const {logs} = useTauriContext();
  const messagesEndRef: any = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scroll({
      behavior: 'smooth',
      top: messagesEndRef.current?.scrollHeight,
    });
  }, [messagesEndRef]);

  // scroll to bottom when we got a new log
  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  return (
    <div
      className="w-full h-full overflow-y-auto border-t border-gray-700 px-5 pt-4 text-gray-100 text-sm font-mono subpixel-antialiased bg-gray-800 pb-4 pt-4 leading-normal overflow-hidden"
      ref={messagesEndRef}
    >
      {logs.map((log, key) => {
        const logKey = `log-${key}`;
        return (
          <div key={logKey} className="mt-4 flex">
            <span className="text-green-400">tauri:~$</span>
            <p className="flex-1 typing items-center pl-2">{log}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Terminal;
