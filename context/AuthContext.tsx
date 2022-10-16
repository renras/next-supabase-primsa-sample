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

const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<Action>;
  isLoading: boolean;
}>({
  state: authState,
  dispatch: () => null,
  isLoading: true,
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

  const [state, dispatch] = useReducer(reducer, authState, () => authState);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) dispatch({ type: "SET_SESSION", payload: session });

        if (event === "SIGNED_IN")
          dispatch({ type: "SET_SESSION", payload: session });

        if (event === "SIGNED_OUT")
          dispatch({ type: "SET_SESSION", payload: null });

        setIsLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
