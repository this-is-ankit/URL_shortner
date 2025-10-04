const {nanoid} = require("nanoid");
const URL = require("../models/url")
async function handleGenerateNewShortURL(req , res)  {
    const shortID = nanoid(8);
    const body = req.body;
    if(!body) return res.status(400).json({error : "URL is required"})
    await URL.create({
        shortId : shortID,
        redirectURL : body.url,
        visitHistory : [],
    });
    return res.render("home" , {id : shortID});
}
    async function handleGetAnalytics(req , res) {
        const shortId =  req.params.shortId;
        const result = await URL.findOne({shortId});
        return res.json( {
            totalclicks : result.visitHistory.length,
            analytics : result.visitHistory,
        });
    }
module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}