
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Reduce the toast duration from 1000000ms to 5000ms (5 seconds)
const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

// Create a React context for the dispatch function
const ToastDispatchContext = React.createContext<React.Dispatch<Action> | undefined>(undefined);

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Move addToRemoveQueue into a custom hook to access dispatch
const useToastRemoveQueue = () => {
  const dispatch = React.useContext(ToastDispatchContext);
  
  if (!dispatch) {
    throw new Error("useToastRemoveQueue must be used within a ToastProvider");
  }
  
  return React.useCallback((toastId: string) => {
    if (toastTimeouts.has(toastId)) {
      return
    }

    const timeout = setTimeout(() => {
      toastTimeouts.delete(toastId)
      dispatch({
        type: "REMOVE_TOAST",
        toastId: toastId,
      })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
  }, [dispatch]);
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Create a ToastContext
const ToastContext = React.createContext<{
  state: State
  toast: (props: Toast) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void }
  dismiss: (toastId?: string) => void
} | undefined>(undefined);

type Toast = Omit<ToasterToast, "id">

// Create a provider component
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    toasts: [],
  });

  const addToRemoveQueue = useToastRemoveQueue();

  const listeners: Array<(state: State) => void> = React.useRef([]).current;

  React.useEffect(() => {
    listeners.forEach((listener) => {
      listener(state);
    });
  }, [state, listeners]);

  // Handle side effects for dismiss toast action
  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open === false) {
        addToRemoveQueue(toast.id);
      }
    });
  }, [state.toasts, addToRemoveQueue]);

  const toast = React.useCallback((props: Toast) => {
    const id = genId();

    const update = (props: ToasterToast) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      });
    
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss();
        },
      },
    });

    return {
      id,
      dismiss,
      update,
    };
  }, []);

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId });
  }, []);

  return (
    <ToastDispatchContext.Provider value={dispatch}>
      <ToastContext.Provider value={{ state, toast, dismiss }}>
        {children}
      </ToastContext.Provider>
    </ToastDispatchContext.Provider>
  );
};

function useToast() {
  const context = React.useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return {
    ...context.state,
    toast: context.toast,
    dismiss: context.dismiss,
  };
}

// Singleton pattern for toast state to allow usage outside of React components
// This is a common pattern for toast libraries
let toastHandler: {
  toast: (props: Toast) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void }
} | null = null;

export const setToastHandler = (handler: any) => {
  toastHandler = handler;
};

// Export a standalone toast function
export const toast = (props: Toast) => {
  if (toastHandler) {
    return toastHandler.toast(props);
  }
  
  console.warn(
    "Toast was triggered before the ToastProvider was initialized. " +
    "For proper toast functionality, ensure ToastProvider is mounted before calling toast()."
  );
  
  return {
    id: "toast-outside-component",
    dismiss: () => console.warn("Toast was created outside of a component and cannot be dismissed programmatically"),
    update: () => console.warn("Toast was created outside of a component and cannot be updated programmatically"),
  };
};

export { useToast, ToastContext };
