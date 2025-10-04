const express = require("express");
const app = express();
const URL = require("./models/url")
const path = require('path')
const PORT = 8001;



app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"))
app.listen(PORT, () => console.log(`Server started at ${PORT} successfully !`));

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRoutes");
const userRoute = require("./routes/user")



const { connectToMongo } = require("./connect");

app.use(express.json()) //MiddleWares
app.use(express.urlencoded({extended: false})) // A Middleware to accept the form data from home.ejs and also json data accept
app.use("/" , staticRoute);
app.use("/url", urlRoute);
app.use("/user", userRoute);

app.get("/test", async (req, res) => {
    const allurl = await URL.find({})
    return res.render('home' , {
        urls : allurl,
    });
})
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                }
            },
        });
    if (!entry) {
        return res.status(404).send("Short URL not found");
    }
    res.redirect(entry.redirectURL);
});
connectToMongo("mongodb://127.0.0.1:27017/short-url")
.then(() => console.log("Connected successfully with mongoDB"))