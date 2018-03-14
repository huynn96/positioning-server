require('app-module-path')
    .addPath(__dirname)
;

const config    = require('config/index');
const bootstrap = require('bootstrap/index');
const Container = require('@sphinx-software/container');
const koaBody   = require('koa-body');
const EventEmitter = require('events').EventEmitter;

(async () => {
    let container  = await bootstrap(config, new Container(new EventEmitter()));
    let httpKernel = await container.make('http.kernel');
    let router     = await container.make('http.router');
    let socket     = await container.make('socket.io');
    let motionSocket = await container.make('motion.socket');
    let server = require('http').createServer(httpKernel.callback());
    httpKernel
		.use(koaBody({
			urlencoded: true
		}))
        .use(router.routes())
        .use(router.allowedMethods())
    ;
    
    server.listen(config.http.port, () => console.log(`Server started at port: ${config.http.port}`));
    socket.setServer(server);
    motionSocket.listen();
})().catch(error => {
    console.error(error);
    process.exit(error.code);
});
