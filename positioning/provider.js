const request = require('request-promise');

exports.register = async (container) => {
    container.singleton('request', async () => request);
};

exports.boot = async (container) => {

};
