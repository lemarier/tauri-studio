import React from "react";
// @ts-ignore
import MonacoEditor from "@monaco-editor/react";

import { EditorLanguage, EditorId } from "../../lib/types";
import { useTauriContext } from "../../lib/context";

const Editor = ({
  editorId,
  value,
  language,
}: {
  editorId: EditorId;
  value: string;
  language: EditorLanguage;
}) => {
  const { setEditorValue } = useTauriContext();
  return (
    <div className="h-full">
      <h3 className="p-2 text-md leading-6 font-medium text-gray-500">
        {language}
      </h3>
      <div className="h-full">
        <MonacoEditor
          className="h-full w-full"
          theme="vs-dark"
          keepCurrentModel={false}
          options={{
            contextmenu: false,
            minimap: { enabled: false },
            wordWrap: "on",
          }}
          defaultValue={value}
          defaultLanguage={language}
          onChange={(value) => {
            if (value) {
              setEditorValue(editorId, value);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
