const express = require("express");
const router  = express.Router();
const { getFeed, createPost, addComment, votePost } = require("../controllers/communityController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/feed",    getFeed);
router.post("/post",   createPost);
router.post("/comment", addComment);
router.post("/vote",   votePost);

module.exports = router;
