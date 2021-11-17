const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
    "review_id",
    "content",
    "score",
    "critic_id",
    "movie_id",
    "critic"
]

function hasOnlyValidProperties(req, res, next) {
    
    const { data } = req.body;
    const invalidProperties = Object.keys(data).filter(
        field => !VALID_PROPERTIES.includes(field)
    )
    if(invalidProperties.length) {
        next({ status: 400, message: `Invalid field(s) found: ${invalidProperties.join(', ')}` })
    } else {
        next();
    }
}

async function reviewExists(req, res, next) {
    const reviewId = Number(req.params.reviewId);
    const review = await service.read(reviewId);
    if(review) {
        res.locals.review = review;
        res.locals.reviewId = reviewId;
        return next();
    } else {
        next({ status: 404, message: `Review cannot be found.` })
    }
}

async function destroy(req, res) {
    const { reviewId } = res.locals;
    await service.delete(reviewId)
    res.sendStatus(204);
}

async function update(req, res) {
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.reviewId,
    }

    const update = await service.update(updatedReview);
    console.log(update)
    res.json({ data: update })
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), hasOnlyValidProperties, asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}


