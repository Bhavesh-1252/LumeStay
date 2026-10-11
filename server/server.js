import app from "./src/app.js";
import connectDB from "./src/config/database.js"

connectDB();

// Server Instance
app.listen(3000, () => {
    console.log("Server is listening at port: 3000");
})