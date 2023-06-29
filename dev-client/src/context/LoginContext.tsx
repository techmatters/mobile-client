import {PropsWithChildren, createContext, useContext, useReducer} from 'react';

type LoginInfo = {name: string};
type State = {user: null | LoginInfo};

const initialState = {user: null};

type ACTION_TYPE = {type: 'login'; name: string};

function loginReducer(state: State, action: ACTION_TYPE): State {
  switch (action.type) {
    case 'login': {
      return {user: {name: action.name}};
    }
  }
}

export const LoginContext = createContext<State>(initialState);
export const LoginDispatchContext = createContext((_: ACTION_TYPE) => {});

export function LoginProvider({children}: PropsWithChildren) {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  return (
    <LoginContext.Provider value={state}>
      <LoginDispatchContext.Provider value={dispatch}>
        {children}
      </LoginDispatchContext.Provider>
    </LoginContext.Provider>
  );
}

export function useLogin() {
  return useContext(LoginContext);
}

export function useLoginDispatch() {
  return useContext(LoginDispatchContext);
}
