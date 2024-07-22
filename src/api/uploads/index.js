const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { serviceUpload, serviceAlbum, validator }) => {
    const uploadsHandler = new UploadsHandler(serviceUpload, serviceAlbum, validator);
    server.route(routes(uploadsHandler));
  },
};
