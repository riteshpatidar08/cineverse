

function createMovieSlug(title) {
   return title.trim().toLowerCase().replace(/[\s\W\-_]+/g, '-');

}

export default createMovieSlug