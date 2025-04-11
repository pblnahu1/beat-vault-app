import express from "express"
import bodyParser from "body-parser"

const app = express()

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("hello to my new app server");
})

app.listen(
    3000,
    () => {
        console.log("server started in the port 3000");
    }
)