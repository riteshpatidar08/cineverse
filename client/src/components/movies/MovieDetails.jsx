import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch  , useSelector} from 'react-redux';
import { fetchMovieById } from '../../../redux/slices/moviesSlice';
function MovieDetails() {
  const { id } = useParams();
  const {singleMovie} = useSelector((state)=>state.movies)
const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchMovieById(id));
  }, []);

  return <div> {JSON.stringify(singleMovie)}
  </div>;
}

export default MovieDetails;
