const express = require('express')
const router = express.Router();

// POSTS
router.get("/", (req, res) => {
    res.send("Get for posts");
})

router.get("/:id", (req, res) => {
    res.send("Get for one post");
})

router.post("/", (req, res) => {
    res.send("POST for posts");
})

router.delete("/:id", (req, res) => {
    res.send("DELETE for posts");
})

module.exports = router;
