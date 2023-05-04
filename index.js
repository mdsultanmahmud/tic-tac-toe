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


// start socket connection

let currentPlayers = []
let allPlayers = []
io.on("connection", (socket) =>{
    console.log("user connected")
    
    socket.on("manage-player", e =>{
        if(e.name != null){
            currentPlayers.push(e.name)

            if(currentPlayers.length >= 2){
                let player1 = {
                    p1name: currentPlayers[0],
                    p1value: "X",
                    p1move: ""
                }
                let player2 = {
                    p2name: currentPlayers[1],
                    p2value: "O",
                    p2move: ""
                }

                let playerpair = {
                    p1: player1,
                    p2: player2,
                    count: 1
                }

                allPlayers.push(playerpair)
                currentPlayers.splice(0,2)

                io.emit("players", {players: allPlayers})
            }
        }
    })

    socket.on("playing", (e) =>{
        if(e.value === "X"){
            let playerMove = allPlayers.find(player => player.p1.p1name === e.name)
            playerMove.p1.p1move = e.id 
            playerMove.count++
        }
        else if(e.value === "O"){
            let playerMove = allPlayers.find(player => player.p2.p2name === e.name)
            playerMove.p2.p2move = e.id 
            playerMove.count++
        }

        io.emit("playing", {allPlayers: allPlayers})
    })
})


app.get("/", (req, res) =>{
    res.sendFile("index.html")
})

server.listen(port, () =>{
    console.log(`server is running from port: ${port}`)
})