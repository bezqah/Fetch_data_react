const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {  //bundles many states in one
    isLoading: false,
    isError: false,
    data: initialData
  });
  console.log('Rendering useDataAPI...')
  
  useEffect(() => {
    console.log('Rendering useEffect...')
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data }); //must have an object passed in with attributes 'type' and/or 'payload'
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" }); //dispatch first dataFetchReducer func which is defined below
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  console.log('Running dataFetchReducer...')
  console.log(`action.type: ${action.type}`)
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};

function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("MIT");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(  // const [returns of the custom hook] = customHook(the arguments/inputs)
    "https://hn.algolia.com/api/v1/search?query=MIT",
    {
      hits: []
    }
  );

  return (
    <Fragment>
      <form
        onSubmit={event => {
          doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);

          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));
