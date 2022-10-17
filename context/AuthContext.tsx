import {
  createContext,
  Dispatch,
  ReactNode,
  useState,
  useReducer,
  useEffect,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";

type AuthState = {
  session: Session | null;
};

const authState: AuthState = {
  session: null,
};

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<Action>;
  isLoading: boolean;
  isError: boolean;
}>({
  state: authState,
  dispatch: () => null,
  isLoading: true,
  isError: false,
});

type Action = { type: "SET_SESSION"; payload: Session | null };

const reducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case "SET_SESSION":
      return {
        ...state,
        session: action.payload,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [state, dispatch] = useReducer(reducer, authState, () => authState);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error && mounted) {
        setIsError(true);
        return;
      }

      if (mounted) {
        dispatch({ type: "SET_SESSION", payload: data.session });
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN")
          dispatch({ type: "SET_SESSION", payload: session });

        if (event === "SIGNED_OUT")
          dispatch({ type: "SET_SESSION", payload: null });
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, isLoading, isError }}>
      {children}
    </AuthContext.Provider>
  );
};
