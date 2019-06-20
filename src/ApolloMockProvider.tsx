import React from 'react';

export type MockQuery = {
  data: any;
  loading: boolean;
  error: null | Error;
  variables: any;
};

export type MockState = {
  queries: {
    [key: string]: MockQuery;
  };
};

export type MockAction = {
  data?: any;
  error?: Error;
  type: string;
  queryName?: string;
};

export type MockDispatch = (action: MockAction) => MockState;

export type MockContext = [MockState, MockDispatch];

const ApolloMockContext = React.createContext<MockContext | undefined>(
  undefined
);

const ACTIONS = {
  QUERY_START: 'QUERY_START',
  QUERY_DONE: 'QUERY_DONE',
  QUERY_ERROR: 'QUERY_ERROR',
};

function reducer(state: MockState, action: MockAction): MockState {
  switch (action.type) {
    case ACTIONS.QUERY_START: {
      const { queryName } = action;
      if (queryName) {
        return {
          ...state,
          queries: {
            ...state.queries,
            [queryName]: {
              error: null,
              variables: null,
              data: null,
              loading: true,
            },
          },
        };
      }
      throw new Error(
        `You must provider correct values for action type: ${action.type}`
      );
    }
    case ACTIONS.QUERY_DONE: {
      const { queryName, data } = action;
      if (queryName && data) {
        return {
          ...state,
          queries: {
            ...state.queries,
            [queryName]: {
              ...state.queries[queryName],
              loading: false,
              data,
            },
          },
        };
      }
      throw new Error(
        `You must provider correct values for action type: ${action.type}`
      );
    }
    case ACTIONS.QUERY_ERROR: {
      const { queryName, error } = action;
      if (queryName && error) {
        return {
          ...state,
          queries: {
            ...state.queries,
            [queryName]: {
              ...state.queries[queryName],
              error,
            },
          },
        };
      }
      throw new Error(
        `You must provider correct values for action type: ${action.type}`
      );
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ApolloMockProvider(props: any) {
  const [state, dispatch] = React.useReducer(
    reducer,
    {
      queries: {},
    },
    (state: MockState) => state
  );

  const value = React.useMemo(() => [state, dispatch], [state]);

  return <ApolloMockContext.Provider value={value} {...props} />;
}

function useApolloMock() {
  const context = React.useContext(ApolloMockContext);
  if (context === undefined) {
    throw new Error('useApolloMock must be used within a ApolloMockProvider');
  }

  const [state, dispatch] = context;

  const setQueryError = React.useCallback(
    (queryName: string, error: any) =>
      dispatch({ type: ACTIONS.QUERY_ERROR, queryName, error }),
    [dispatch]
  );
  const setQueryStart = React.useCallback(
    (queryName: string) => dispatch({ type: ACTIONS.QUERY_START, queryName }),
    [dispatch]
  );
  const setQueryDone = React.useCallback(
    (queryName: string, data: any) =>
      dispatch({ type: ACTIONS.QUERY_DONE, queryName, data }),
    [dispatch]
  );

  return {
    state,
    dispatch,
    setQueryError,
    setQueryDone,
    setQueryStart,
  };
}

export { ApolloMockProvider, useApolloMock };
