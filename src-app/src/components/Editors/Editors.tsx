import React from "react";
import SplitPane from "react-split-pane";

import { Editor } from "../Editor";
import { EditorValues, EditorLanguage, EditorId } from "../../lib/types";

const Editors = ({ editors }: { editors?: EditorValues }) => {
  // todo(lemarier): return loading state
  if (!editors) {
    return <></>;
  }

  return (
    <SplitPane split="vertical" maxSize="80%" minSize={300} defaultSize="50%">
      <Editor
        editorId="rust"
        language={EditorLanguage.Rust}
        value={editors.rust}
      />
      <Editor
        editorId="html"
        language={EditorLanguage.Html}
        value={editors.html}
      />
    </SplitPane>
  );
};

export default Editors;
