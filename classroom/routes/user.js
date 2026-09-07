const express = require('express')
const router = express.Router();

//USERS
router.get("/", (req, res) => {
    res.send("Get for users");
})

router.get("/:id", (req, res) => {
    res.send("Get for one user");
})

router.post("/", (req, res) => {
    res.send("POST for users");
})

router.delete("/:id", (req, res) => {
    res.send("DELETE for users");
})

module.exports = router;