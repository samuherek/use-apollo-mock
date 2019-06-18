import React from 'react';

export type MockState = {
  data: any;
  loading: boolean;
  error: null | Error;
};

export type MockAction = {
  data?: any;
  error?: Error;
  type: string;
};

export type Query = Object | Function;

export type Options = {
  error?: Error | null;
  variables?: Object | null;
};

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_DATA: 'SET_DATA',
};

function reducer(state: MockState, action: MockAction): MockState {
  switch (action.type) {
    case ACTIONS.SET_DATA: {
      if (action.data) {
        return {
          ...state,
          loading: false,
          data: action.data,
        };
      }
      throw new Error(
        `You must provider "data" for action type: ${action.type}`
      );
    }
    case ACTIONS.SET_ERROR: {
      if (action.error) {
        return {
          ...state,
          loading: false,
          error: action.error,
        };
      }
      throw new Error(
        `You must provider "error" for action type: ${action.type}`
      );
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function useQueryMock(query: Query, opts: Options) {
  const { error = null, variables = null } = opts || {};
  const timer = React.useRef<any>();

  const [state, dispatch] = React.useReducer(reducer, {
    data: null,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    if (!timer.current) {
      timer.current = setTimeout(() => {
        if (error) {
          if (typeof error !== 'object' || !error.message) {
            throw new Error('useQueryMock: you provided incorrect error');
          }
          dispatch({ type: ACTIONS.SET_ERROR, error });
          return;
        }

        if (query) {
          if (typeof query === 'function') {
            if (!variables) {
              throw new Error(
                'useQueryMock: You must provide variables if your query is function'
              );
            }
            dispatch({ type: ACTIONS.SET_DATA, data: query(variables) });
            return;
          }
          if (typeof query === 'object') {
            dispatch({ type: ACTIONS.SET_DATA, data: query });
            return;
          }
          throw new Error('useQueryMock: you provided incorrect query');
        }

        throw new Error(
          'useQueryMock: You must provider either query or error'
        );
      }, 1000);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
  };
}
