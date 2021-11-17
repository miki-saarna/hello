const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function checkIfValid(req, res, next) {
    const movieId = Number(req.params.movieId);
    const data = await service.findMovie(movieId);
    
    if(data.length) {
        res.locals.movieId = movieId
        res.locals.data = data;
        return next()
    } else {
        next({ status: 404, message: "Movie cannot be found." })
    }
}


async function list(req, res) {
    const data = await service.list();
    const { is_showing } = req.query;
    
    if(is_showing) {
        const listOfMoviesShowing = await service.listMoviesShowing();
        const moviesShowing = data.filter(movie => 
            // using map function to consolidate only the values of each key into an array so that includes method can be applied easily
            listOfMoviesShowing.map(movie => movie.movie_id).includes(movie.movie_id)
            )
        res.json({
            data: moviesShowing
        })
    } else {
        res.json({
            data,
        });
    }
}

async function findMovie(req, res) {
    const foundMovie = res.locals.data;
    const data = foundMovie[0]
    res.json({ data })
}

async function findTheatersShowingMovie(req, res) {
    const movieId = res.locals.movieId;
    const data = await service.findTheatersShowingMovie(movieId);
    res.json({ data })
}

async function findReviewsForMovie(req, res) {
    const movieId = res.locals.movieId;
    const data = await service.findReviewsForMovie(movieId);
    res.json({ data })
}



module.exports = {
    list: asyncErrorBoundary(list),
    findMovie: [asyncErrorBoundary(checkIfValid), asyncErrorBoundary(findMovie)],
    findTheatersShowingMovie: [asyncErrorBoundary(checkIfValid), asyncErrorBoundary(findTheatersShowingMovie)],
    findReviewsForMovie: [asyncErrorBoundary(checkIfValid), asyncErrorBoundary(findReviewsForMovie)],
}