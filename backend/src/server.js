const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const htttp = require('http');


const app = express();
const server = htttp.Server(app);
const io = socketio(server);

const connectedUsers = {  };

mongoose.connect('mongodb+srv://omnistack:omnistack@omnistack-iadxk.mongodb.net/teste?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true    
})

io.on('connection', socket =>{
    const {user_id} = socket.handshake.query;

    connectedUsers[user_id] = socket.id;

});

app.use((req, res, next) =>{
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next()
})


// req.query = Acessar query parms (para filtros)
// req.params = Acessar route params (para edicao e delete)
// req.body = Acessar corpo da requisicao (para criacao quanto edicao de registros)

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);



server.listen(3333);