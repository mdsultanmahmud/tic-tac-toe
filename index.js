const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const path = require("path")
const http  = require("http")
const {Server} = require("socket.io")
const server = http.createServer(app)
const io = new Server(server)

// for using htlm file 
app.use(express.static(path.resolve("")))

app.get("/", (req, res) =>{
    res.sendFile("index.html")
})

server.listen(port, () =>{
    console.log(`server is running from port: ${port}`)
})