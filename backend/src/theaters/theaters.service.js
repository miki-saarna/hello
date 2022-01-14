module.exports = db => {

async function moviesInfo(theater_id) {
    return db("movies_theaters as mt")
        .join("movies as m", "mt.movie_id", "m.movie_id")
        .select("mt.*", "m.*")
        .where({ theater_id })
}

async function includeMoviesAtTheater(theater) {
    theater.movies = await moviesInfo(theater.theater_id)
    return theater
}

async function list() {
    return db("theaters")
        .select("*")
        .then(theaters => Promise.all(theaters.map(theater => includeMoviesAtTheater(theater))))
    }

return {
    list,
}
}