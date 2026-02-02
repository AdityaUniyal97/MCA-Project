const users = [
    { username: "ABS", password: "1234", role: "Driver" },
    { username: "STU", password: "1111", role: "Student" }
];

exports.loginUser = (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    res.json({
        message: "Login successful",
        role: user.role
    });
};
