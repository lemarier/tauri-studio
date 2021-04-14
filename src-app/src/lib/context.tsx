import React, {
  FC,
  useMemo,
  useReducer,
  useContext,
  createContext,
} from "react";

import { TauriProject, EditorId, ProjectState, Config, AppView } from "./types";

const initialState: AppState = {
  logs: [],
  currentView: AppView.Init,
};

type TauriContext = {
  addLog: (value: string) => void;
  setConfig: (config: Config) => void;
  setProject: (project: TauriProject) => void;
  setView: (view: AppView) => void;
  setProjectState: (state: ProjectState) => void;
  closeProject: () => void;
  setEditorValue: (editor: EditorId, value: string) => void;
} & AppState;

interface AppState {
  currentView: AppView;
  config?: Config;
  project?: TauriProject;
  logs: string[];
}

type Action =
  | {
      type: "SET_PROJECT";
      project: TauriProject;
    }
  | {
      type: "SET_CONFIG";
      config: Config;
    }
  | {
      type: "SET_VIEW";
      view: AppView;
    }
  | {
      type: "SET_PROJECT_STATE";
      state: ProjectState;
    }
  | {
      type: "CLOSE_PROJECT";
    }
  | {
      type: "ADD_LOG";
      value: string;
    }
  | {
      type: "SET_EDITOR_VALUE";
      editor: EditorId;
      value: string;
    };

function reducer(state: AppState, action: Action) {
  switch (action.type) {
    case "SET_PROJECT": {
      return {
        ...state,
        project: action.project,
      };
    }
    case "SET_CONFIG": {
      return {
        ...state,
        config: action.config,
      };
    }
    case "SET_VIEW": {
      return {
        ...state,
        currentView: action.view,
      };
    }
    case "SET_PROJECT_STATE": {
      if (state.project) {
        state.project.state = action.state;
      }
      return {
        ...state,
      };
    }
    case "CLOSE_PROJECT": {
      delete state.project;
      return {
        ...state,
      };
    }
    case "ADD_LOG": {
      return {
        ...state,
        // keep only latest 100 elements in our logs
        logs: [...state.logs.slice(-100), action.value],
      };
    }
    case "SET_EDITOR_VALUE": {
      if (state.project) {
        state.project.editors[action.editor] = action.value;
      }
      return state;
    }
    default:
      return state;
  }
}

export const Context = createContext<AppState>(initialState);

Context.displayName = "TauriBuilderContext";

export const Provider: FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setProject = useMemo(() => {
    return (project: TauriProject) =>
      dispatch({ type: "SET_PROJECT", project });
  }, []);

  const setConfig = useMemo(() => {
    return (config: Config) => dispatch({ type: "SET_CONFIG", config });
  }, []);

  const setView = useMemo(() => {
    return (view: AppView) => dispatch({ type: "SET_VIEW", view });
  }, []);

  const setProjectState = useMemo(() => {
    return (state: ProjectState) =>
      dispatch({ type: "SET_PROJECT_STATE", state });
  }, []);

  const setEditorValue = useMemo(() => {
    return (editor: EditorId, value: string) =>
      dispatch({ type: "SET_EDITOR_VALUE", editor, value });
  }, []);

  const addLog = useMemo(() => {
    return (value: string) => dispatch({ type: "ADD_LOG", value });
  }, []);

  const closeProject = useMemo(() => {
    return () => dispatch({ type: "CLOSE_PROJECT" });
  }, []);

  // we update when our state change
  const value = useMemo(
    () => ({
      ...state,
      addLog,
      setConfig,
      setView,
      setProject,
      setProjectState,
      closeProject,
      setEditorValue,
    }),
    [
      addLog,
      setProject,
      setConfig,
      setView,
      setProjectState,
      setEditorValue,
      closeProject,
      state,
    ]
  );

  return <Context.Provider value={value} {...props} />;
};

export const useTauriContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(`useTauriContext must be used within a Provider`);
  }
  return context as TauriContext;
};

export const ManagedContext: FC = ({ children }) => {
  return <Provider>{children}</Provider>;
};
