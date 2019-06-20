# use-apollo-mock

Package helping you speed up the frontend development with Apollo client when the backend implementation is lacking behind. 

#### Reason behind making this package

While working with graphql, I had a realization that it's much easier to define the graphql queries/mutations only after the forntend feature is partially implemented. The issue was, how do you fake the apollo queries in a simple way? So, after the backend is implemneted you have to do minimal changes on the frotnend?

The result is a super simple quick package for faking apollo client queires for faster prototyping. 


## How it's used

#### 1. install the package
The package is assuming you use `react` `react-apollo` and `grapqhl-tag` (`apollo-boost` has `graphql-tag` included)

`npm install --save use-apollo-mock`

#### 2. use grapqhl query as a react hook

Largly inspirate from `react-apollo-hooks`, you simply provide the query (you will later use for real) to the `userQueryMock` hook and also provide fake data through options.

```javascript
import React from 'react';
improt { useQueryMock } from 'use-apollo-mock';

// Standard graphql query. In whatever way you write it
const QUERY = gql`
  query myQuery {
    myQuery {
      data
    }
  }
`;

// This is the fake data we want to get back. Pretending
// we are receiving it from the server. 
// Notice I follow the exact same shape of the query
// to replicate the shape the server would send back.
const fakeData = {
  myQuery: {
    data: 'awesome'
  }
}

// Use in a React component as a hook. 
function Component() {
  const { data, loading, error } = useQueryMock(QUERY, {
    data: fakeData
  });
  
  return null;
}
 
```

This will immitate the loading state and will return you teh fake data. 


#### 3. Cache the fake data results

You can take it one step further and immitate the caching as well. Just wrap your app with a `ApolloMockProvider`. it doesn't need anything else. 

```javascript
import React from 'react';
import { ApolloMockProvider } from 'use-apollo-mock`;

function App() {
  return (
    <ApolloMockProvider>
      <YourApp />
    </ApolloMockProvider>
  )
}

```

#### 4. Test an error case

You can also provide an erro mock, to pretend you got an error from the server. Just use the same principal from step 2:

```javascript

// Use in a React component as a hook. 
function Component() {
  const { data, loading, error } = useQueryMock(QUERY, {
    data: fakeData,
    error: new Error('Something bad happened')
  });
  
  return null;
}

```


## Final Notes
Please keep in mind this is work in progress and is meant to be a simple quick and dirty help for prototyping. However, if you find this package helpful and want to improve it, feel free to open a issue or create a pull request. 

## IMPORTANT
At the moment it only supports the "Query". It dooesn't fake "Mutation". I might add it when I have a little bit more time :)
