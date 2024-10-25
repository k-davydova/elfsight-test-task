import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const API_URL = 'https://rickandmortyapi.com/api/character/';

export function DataProvider({ children }) {
  const [activePage, setActivePage] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [info, setInfo] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    setIsFetching(true);
    setIsError(false);

    const url = new URL(API_URL);

    for (const [key, value] of searchParams.entries()) {
      url.searchParams.set(key, value);
    }

    axios
      .get(url)
      .then(({ data }) => {
        setIsFetching(false);
        setCharacters(data.results);
        setInfo(data.info);
      })
      .catch((e) => {
        setIsFetching(false);
        setIsError(true);
        console.error(e);
      });
  };

  useEffect(() => {
    const activePageFromUrl = searchParams.get('page');

    if (!activePageFromUrl) {
      setSearchParams((prevParams) => {
        const params = new URLSearchParams(prevParams);
        params.set('page', '1');

        return params;
      });
    } else {
      setActivePage(activePageFromUrl - 1);
    }

    fetchData();
  }, [searchParams, setActivePage, setSearchParams]);

  const dataValue = useMemo(
    () => ({
      activePage,
      setSearchParams,
      characters,
      isFetching,
      isError,
      info
    }),
    [activePage, characters, isFetching, isError, info, setSearchParams]
  );

  return (
    <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
  );
}

const DataContext = createContext({});

export const useData = () => useContext(DataContext);
