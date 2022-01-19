const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function checkIfValid(req, res, next) {
    const movieId = Number(req.params.movieId);
    const data = await service(req.app.get('db')).findMovie(movieId);
    
    if(data.length) {
        res.locals.movieId = movieId
        res.locals.data = data;
        return next()
    } else {
        next({ status: 404, message: "Movie cannot be found." })
    }
}

async function list(req, res) {
    const  { is_showing }  = req.query;
    // if(is_showing) {
    //     const listOfMoviesShowing = await service(req.app.get('db')).listMoviesShowing();
    //     const set = new Set();
    //     listOfMoviesShowing.forEach(({ movie_id }) => set.add(movie_id));
    //     const moviesShowing = data.filter(movie => {
    //         return set.has(movie.movie_id);
    //     })
    //     res.json({ data: moviesShowing })
    // } else {

    if (is_showing) {
        const listOfMoviesShowing = await service(req.app.get('db')).listMoviesShowing(is_showing);
        res.json({ data: listOfMoviesShowing})
    } else {
        const data = await service(req.app.get('db')).list();
        res.json({ data });
    }
}

async function findMovie(req, res) {
    const foundMovie = res.locals.data;
    const data = foundMovie[0]
    res.json({ data })
}

async function findTheatersShowingMovie(req, res) {
    const movieId = res.locals.movieId;
    const data = await service(req.app.get('db')).findTheatersShowingMovie(movieId);
    res.json({ data })
}

async function findReviewsForMovie(req, res) {
    const movieId = res.locals.movieId;
    const data = await service(req.app.get('db')).findReviewsForMovie(movieId);
    res.json({ data })
}



module.exports = {
    list: asyncErrorBoundary(list),
    findMovie: [asyncErrorBoundary(checkIfValid), asyncErrorBoundary(findMovie)],
    findTheatersShowingMovie: [asyncErrorBoundary(checkIfValid), asyncErrorBoundary(findTheatersShowingMovie)],
    findReviewsForMovie: [asyncErrorBoundary(checkIfValid), asyncErrorBoundary(findReviewsForMovie)],
}