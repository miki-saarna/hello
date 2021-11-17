const knex = require("../db/connection");

async function read(reviewId) {
    return knex("reviews")
        .select("*")
        .where({ review_id: reviewId})
        .first();
}

// find the critic that corresponds to the given critic_id
async function readCritic(critic_id) {
    return knex("critics")
        .where({ critic_id })
        .first();
}

// sets the critic for the review that corresponds to the given critic_id
async function setCritic(review) {
    review.critic = await readCritic(review.critic_id);
    return review;
}

async function destroy(reviewId) {
    return knex("reviews")
        .where({ review_id: reviewId })
        .del();
}

// async function update(updatedPost) {
//     return knex("reviews as r")
//         .join("critics as r", "r.critic_id", "c.critic_id")
//         .select("r.*", "c.*")
//         .where({ review_id: updatedPost.review_id })
//         .update(updatedPost, "*")
//         .then((updatedPost) => updatedPost[0]);
// }

async function update(updatedReview) {
    return knex("reviews")
        // is there a way to view/send the update?
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview, "*")
        .then(() => read(updatedReview.review_id))
        .then(setCritic);
}

module.exports = {
    read,
    update,
    delete: destroy,
}