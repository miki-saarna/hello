const knex = require("../db/connection");

async function moviesInfo(theater_id) {
    return knex("movies_theaters as mt")
        .join("movies as m", "mt.movie_id", "m.movie_id")
        .select("mt.*", "m.*")
        .where({ theater_id })
}

async function includeMoviesAtTheater(theater) {
    theater.movies = await moviesInfo(theater.theater_id)
    return theater
}

async function list() {
    return knex("theaters")
        .select("*")
        .then(theaters => Promise.all(theaters.map(theater => includeMoviesAtTheater(theater))))
    }

module.exports = {
    list,
}