import { Routes, Route } from "react-router-dom";
import Movies from "../pages/Movies";
import Movie from "../pages/Movie";
import { useState, useMemo, useEffect, createContext } from "react";
import axios from "axios";
import NavbarComp from "../components/Login/NavbarComp";

import RequireAdminAuth from "../components/Auth/RequireAdminAuth";
import Home from "../pages/Home";
import VideoPage from "../pages/VideoPage";
import Profile from "../pages/Profile";


export const MoviesContext = createContext();

const MoviesModule = () => {
  const [movies, setMovies] = useState();

  useEffect(() => {
    const localMovies = localStorage.getItem("movies");

    if (localMovies) {
      setMovies(JSON.parse(localMovies));
    } else
      axios
        .get(
          "https://my-json-server.typicode.com/nadaalsnosy/mockNetflix/movies"
        )
        .then((res) => {
          const moviesData = res.data;
          // moviesData.map((m) => (m._id = `${m._id}`));
          setMovies(res.data);
        });
  }, []);

  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  const contextValue = useMemo(
    () => ({
      movies,
      setMovies,
    }),
    [movies]
  );

  return (
    <MoviesContext.Provider value={contextValue}>
      <NavbarComp />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/mainVideo" element={<VideoPage />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/showLists" element={<RequireAdminAuth />}>
          <Route index element={<Movies />} />
          <Route path=":id" element={<Movie />} />
        </Route>
      </Routes>
    </MoviesContext.Provider>
  );
};

export default MoviesModule;