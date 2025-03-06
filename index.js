// making server
const app = require("./app");

// defining port
const PORT = 5000;

// starting the server

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
