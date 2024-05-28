function App() {
  const { useState, useEffect } = React;
  const { Container } = ReactBootstrap;
  const [data, setData] = useState({ hits: [] });
  const [url, setUrl] = useState("http://localhost:8080/data.json");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log("Rendering App");

  useEffect(() => { //if useEffect uses variables from useState, then a re-render will fire
    console.log("Fetching data...");
    const fetchData = async () => { //fetching data is a side effect because it does not directly re-render the component
      setIsLoading(true);
      const result = await axios(url);  //axios is a library that fetches data --- await axios to fetch data from the specified url
      setData(result.data);
    };

    fetchData();
  }, []); //useEffect is watching this empty list or whatever is in it (listener for changes in it); if empty then only fires ONCE

  return (
    <Container>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() => setUrl("http://localhost:8080/data.json")}
      >
        Search
      </button>

      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Container>
  );
}
// ========================================
ReactDOM.render(<App />, document.getElementById("root"));

//  // "https://hn.algolia.com/api/v1/search?query=redux"
