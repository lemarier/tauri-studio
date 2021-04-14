import React, { FC, useEffect } from "react";
// @ts-ignore
import ScrollToBottom, { useScrollToBottom } from "react-scroll-to-bottom";

import { useTauriContext } from "../../lib/context";

const Terminal: FC = () => {
  const { logs } = useTauriContext();
  const scrollToBottom = useScrollToBottom();

  // scroll to bottom when we got a new log
  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  return (
    <ScrollToBottom className="w-full h-full overflow-y-auto border-t border-gray-700 px-5 pt-4 text-gray-100 text-sm font-mono subpixel-antialiased bg-gray-800 pb-20 pt-4 leading-normal overflow-hidden">
      {logs.map((log, key) => {
        const logKey = `log-${key}`;
        return (
          <div key={logKey} className="mt-4 flex">
            <span className="text-green-400">tauri:~$</span>
            <p className="flex-1 typing items-center pl-2">{log}</p>
          </div>
        );
      })}
    </ScrollToBottom>
  );
};

export default Terminal;
