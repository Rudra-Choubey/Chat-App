const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
const socket = require('socket.io')

app.use(express.static('public'))

let server = app.listen(PORT, function(){
    console.log(`Runnning on port ${PORT}`)
})
const io = socket(server)
let users = []
io.on('connection',function(socket){
    socket.on('chat',function(chat){
        io.sockets.emit('chat',chat)
    })
    socket.on('login',function(data){
        let names = []
        for(let i = 0;i < users.length;i++){
            names.push(users[i].name)
        }
        if(!names.includes(data.username)){
            users.push({
                name: data.username,
                id: socket.id
            })
            io.sockets.emit('user update', users)
            socket.emit('login status',{
                success: true,
                message: `${data.username} Logined`,
            })
        }
        else
        {
            socket.emit('login status',{
                success: false,
                message: 'Username must be unique'
            })
            console.log("LOGIN FAILED!!!!")
        }
    })
    socket.on('disconnect',function(){
        for (let i = 0; i < users.length; i++) {
            const element = users[i];
            if(element.id == socket.id){
                users.splice(i, 1);
                io.sockets.emit('user update',users);
                break;
            }
        }
    })
})