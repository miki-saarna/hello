import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DetailedMovie from "./DetailedMovie";
import ErrorAlert from "../shared/ErrorAlert";
import { listMovies } from "../utils/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function DetailedMoviesList() {
  const  query = useQuery();
  const is_showing = query.get("is_showing");
  
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    const abortController = new AbortController();
    listMovies(abortController.signal, is_showing).then(setMovies).catch(setError);

    return () => abortController.abort();
  }, [is_showing]);

  const list = movies.map((movie) => (
    <DetailedMovie key={movie.movie_id} movie={movie} />
  ));

  return (
    <main className="container">
      <ErrorAlert error={error} />
      <h2 className="font-poppins">All Movies</h2>
      <hr />
      <section>{list}</section>
    </main>
  );
}

export default DetailedMoviesList;
