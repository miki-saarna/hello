const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed")

router.route("/").get(controller.list).all(methodNotAllowed);

router.route("/:movieId").get(controller.findMovie).all(methodNotAllowed);

router.route("/:movieId/theaters").get(controller.findTheatersShowingMovie).all(methodNotAllowed);

router.route("/:movieId/reviews").get(controller.findReviewsForMovie).all(methodNotAllowed);

module.exports = router;