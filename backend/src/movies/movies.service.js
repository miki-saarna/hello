module.exports = db => {

async function list() {
    const movies = await db("movies").select("*");
    const moviesWithReviews = [];
    for (const movie of movies) {
        movie.reviews = await findReviewsForMovie(movie.movie_id);
        moviesWithReviews.push(movie);
    }
    return moviesWithReviews;
}

async function listMoviesShowing(queryParam) {
    let movieIds;
    if (queryParam === 'true') {
        movieIds = await db("movies_theaters").select("movie_id").where({ is_showing: true });
    } else {
        movieIds = await db("movies_theaters").select("movie_id").where({ is_showing: false });
    }
    const set = new Set();
    movieIds.forEach((value) => {
        set.add(value.movie_id);
    })
    const movies = [];
    for (const movieId of set.values()) {
        const movie = await db("movies").select("*").where({ movie_id: movieId }).then((movieFound) => movieFound[0]);
        movie.reviews = await findReviewsForMovie(movieId);
        movies.push(movie);
    }
    return movies;
}
////////////////////////////////
async function findCritic(critic_id) {
    return db("critics")
        .select("*")
        .where({ critic_id })
        .then(review => review[0])
}

async function addCriticToReview(review) {
    review.critic = await findCritic(review.critic_id);
    return review;
}

async function findReviewsForMovie(movie_id) {
    return db("reviews")
        .select("*")
        .where({ movie_id })
        .then(reviews => Promise.all(reviews.map(review => addCriticToReview(review))))
}
////////////////////////////////
async function findMovie(movieId) {
    return db("movies").select("*").where({ movie_id: movieId })
}

async function findTheatersShowingMovie(movieId) {
    return db("movies_theaters as mt")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("mt.*", "t.*")
        .where({ movie_id: movieId})
}


return {
    list,
    listMoviesShowing,
    findMovie,
    findTheatersShowingMovie,
    findReviewsForMovie,
}

}