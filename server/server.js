import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/database.js"

connectDB();

// Server Instance
app.listen(config.PORT || 3000, () => {
    console.log("Server is listening at port: 3000");
})