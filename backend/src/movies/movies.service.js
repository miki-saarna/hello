const knex = require("../db/connection");

async function list() {
    return knex("movies").select("*");
}

async function listMoviesShowing() {
    return knex("movies_theaters").select("movie_id").where({ is_showing: true });
}

async function findMovie(movieId) {
    return knex("movies").select("*").where({ movie_id: movieId })
}

async function findTheatersShowingMovie(movieId) {
    return knex("movies_theaters as mt")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("mt.*", "t.*")
        .where({ movie_id: movieId})
}

async function findCritic(critic_id) {
    return knex("critics")
        .select("*")
        .where({ critic_id })
        .then(review => review[0])
}

async function addCriticToReview(review) {
    review.critic = await findCritic(review.critic_id);
    return review;
}

async function findReviewsForMovie(movie_id) {
    return knex("reviews")
        .select("*")
        .where({ movie_id })
        .then(reviews => Promise.all(reviews.map(review => addCriticToReview(review))))
}

module.exports = {
    list,
    listMoviesShowing,
    findMovie,
    findTheatersShowingMovie,
    findReviewsForMovie,
}