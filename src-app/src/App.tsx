import React, { FC, useMemo } from "react";

import { Init as InitPage, Editors as EditorsPage } from "./pages";
import { useTauriContext } from "./lib/context";
import { AppView } from "./lib/types";

const App: FC = () => {
  const { currentView } = useTauriContext();

  const AppMarkup = useMemo(() => {
    switch (currentView) {
      case AppView.Init:
        return InitPage;
      case AppView.Editors:
        return EditorsPage;
    }
  }, [currentView]);

  return <AppMarkup />;
};

export default App;
