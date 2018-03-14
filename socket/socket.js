class Socket {
    constructor(io) {
        this.io = io;
    }
    
    getSocket() {
        return this.io;
    }
    
    setSocket(io) {
        this.io = io;
        return this;
    }
    
    setServer(server) {
        this.io = this.io(server);
        return this;
    }
}

module.exports = Socket;