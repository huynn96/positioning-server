exports.seed = async database => {
	await database('room').truncate();
	return await database('room').insert([
		{
			room_name: 'Phòng nhà trọ',
			address: 'Ngõ 1 Phạm Văn Đồng'
		}
	]);
};
