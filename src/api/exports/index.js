const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { produserService, playlistsService, validator }) => {
    const exportsHandler = new ExportsHandler(produserService, playlistsService, validator);
    server.route(routes(exportsHandler));
  },
};
