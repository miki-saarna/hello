module.exports = db => {

async function read(reviewId) {
    return db("reviews")
        .select("*")
        .where({ review_id: reviewId})
        .first();
}

// find the critic that corresponds to the given critic_id
async function readCritic(critic_id) {
    return db("critics")
        .where({ critic_id })
        .first();
}

// sets the critic for the review that corresponds to the given critic_id
async function setCritic(review) {
    review.critic = await readCritic(review.critic_id);
    return review;
}

async function destroy(reviewId) {
    return db("reviews")
        .where({ review_id: reviewId })
        .del();
}

// async function update(updatedPost) {
//     return db("reviews as r")
//         .join("critics as r", "r.critic_id", "c.critic_id")
//         .select("r.*", "c.*")
//         .where({ review_id: updatedPost.review_id })
//         .update(updatedPost, "*")
//         .then((updatedPost) => updatedPost[0]);
// }

async function update(updatedReview) {
    return db("reviews")
        // is there a way to view/send the update?
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview, "*")
        .then(() => read(updatedReview.review_id))
        .then(setCritic);
}

return {
    read,
    update,
    delete: destroy,
}
}