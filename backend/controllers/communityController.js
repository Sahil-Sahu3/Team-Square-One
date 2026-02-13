const Post = require("../models/Post");

// GET /community/feed
const getFeed = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const posts = await Post.find(filter)
      .populate("vendor", "name")
      .populate("comments.author", "name")
      .sort({ votes: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, count: posts.length, data: posts });
  } catch (err) { next(err); }
};

// POST /community/post
const createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      res.status(400); throw new Error("title and content are required");
    }
    const post = await Post.create({
      vendor: req.user._id, title, content, category,
    });
    await post.populate("vendor", "name");
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
};

// POST /community/comment
const addComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;
    if (!postId || !content) {
      res.status(400); throw new Error("postId and content are required");
    }
    const post = await Post.findById(postId);
    if (!post) { res.status(404); throw new Error("Post not found"); }

    post.comments.push({ author: req.user._id, content });
    await post.save();
    await post.populate("comments.author", "name");

    res.json({ success: true, data: post.comments[post.comments.length - 1] });
  } catch (err) { next(err); }
};

// POST /community/vote
const votePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) { res.status(404); throw new Error("Post not found"); }

    const alreadyVoted = post.votedBy.includes(req.user._id);

    if (alreadyVoted) {
      // Undo vote
      post.votedBy = post.votedBy.filter((id) => id.toString() !== req.user._id.toString());
      post.votes = Math.max(0, post.votes - 1);
    } else {
      // Add vote
      post.votedBy.push(req.user._id);
      post.votes += 1;
    }

    await post.save();
    res.json({ success: true, votes: post.votes, voted: !alreadyVoted });
  } catch (err) { next(err); }
};

module.exports = { getFeed, createPost, addComment, votePost };
