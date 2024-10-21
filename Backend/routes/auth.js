const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
    try {
        if (req.body.username.length < 3) {
            return res.status(400).json({ message: "Password must be at least 3 characters long" });
        }
        // Fixed regex pattern
        const passwordcheck = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
        
        if (req.body.password.length < 10) {
            return res.status(400).json({ message: "Password must be at least 10 characters long" });
        }
        if (!passwordcheck.test(req.body.password)) {
            return res.status(400).json({
                message: "Password  must contain at least one number and one special character"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        // Added consistent JSON structure for error handling
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Added return statement
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            // Added return statement
            return res.status(400).json({ message: "Wrong password" });
        }

        res.status(200).json(user);
    } catch (err) {
        // Added consistent JSON structure for error handling
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await User.findOne({ email: req.body.email });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
