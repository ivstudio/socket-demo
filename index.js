const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) =>{
   res.sendFile(__dirname + '/public/index.html');
});

//Namespace
const tech = io.of('/tech');


tech.on('connection', (socket) => {
   socket.on('join', (data) => {
       socket.join(data.room);
       tech.in(data.room).emit('message', `new user ${data.room} room!`)
   });

   socket.on('message', (data) => {
       tech.in(data.room).emit('message', data.msg);
   });

   socket.on('disconnect', () => {
       tech.emit('message', 'user disconnected');
   });
});