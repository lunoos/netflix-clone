import React, {useState, useEffect } from 'react';
import instance from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";
function Row({ title, fetchUrl, islargerow}){
	const [movies, setMovies] = useState([]);
	const [trailerUrl, setTrailerUrl] = useState("");

	useEffect(()=>{
		async function fetchData(){
			const request = await instance.get(fetchUrl);
			setMovies(request.data.results);
			return request;
		}
		fetchData();
	}, [fetchUrl]);

	const opts = {
		height: "390",
		width: "100%",
		playerVars: {
		   autoplay: 1	
		}
	}
	const handleClick = (movie) => {
		if(trailerUrl) {
			setTrailerUrl("");
		}else {
			movieTrailer(movie?.name || "")
			  .then((url) => {
			  	const urlParams = new URLSearchParams(new URL(url).search)
			  	console.log(urlParams);
			  	setTrailerUrl(urlParams.get("v"));
			  })
			  .catch((error) => console.log(error));
		}
	};

	return (
		<div className="row">
			<h2>{title}</h2>
			<div className="row__posters">
			{movies.map(movie => (
				<img 
				key = {movie.id}
				onClick = {() => handleClick(movie)}
				className = {`row__poster ${islargerow && "row__posterLarge"}` }
				src = {`${base_url}${islargerow ? movie.poster_path : movie.backdrop_path}`} 
				alt={movie.name}/>
			))
			}
			</div>
			{ trailerUrl && <YouTube videoId = {trailerUrl} opts={opts} />}
		</div>
		)
}

export default Row;