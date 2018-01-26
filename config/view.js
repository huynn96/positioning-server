const path = require('path');
module.exports = {
    directory: path.normalize(path.join(__dirname, '..', 'resources', 'views')),
    options: {
        watch: true,
        noCache: true
    }
};
