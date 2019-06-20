import React from 'react';
import { useApolloMock } from './ApolloMockProvider';

export type Query = any;

export type Options = {
  error?: Error | null;
  variables?: Object | null;
  data?: any;
};

function useQueryMock(query: Query, opts: Options) {
  const {
    error = null,
    // variables = null,
    data = null,
  } = opts || {};

  const timer = React.useRef<any>();
  const { state, setQueryStart, setQueryDone, setQueryError } = useApolloMock();

  const queryName = query.definitions[0].name.value;

  React.useEffect(() => {
    if (state.queries[queryName]) {
      return;
    }

    if (!timer.current) {
      setQueryStart(queryName);

      timer.current = setTimeout(() => {
        if (error) {
          if (typeof error !== 'object' || !error.message) {
            throw new Error('useQueryMock: you provided incorrect error');
          }
          setQueryError(queryName, error);
          return;
        }

        if (query) {
          // if (typeof query === 'function') {
          //   if (!variables) {
          //     throw new Error(
          //       'useQueryMock: You must provide variables if your query is function'
          //     );
          //   }
          //   setQueryDone(queryName, query(variables));
          //   return;
          // }
          if (typeof query === 'object') {
            setQueryDone(queryName, data);
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
  }, [query]);

  return {
    data: null,
    loading: true,
    error: null,
    ...state.queries[queryName],
  };
}

export { useQueryMock };
