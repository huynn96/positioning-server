const RoomRepository = require('./room.repository');

exports.register = async (container) => {
	container.singleton('RoomRepository', async () => new RoomRepository(
		await container.make('database')
	));
};

exports.boot = async (container) => {

};
