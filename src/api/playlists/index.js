const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'plyalists',
  version: '1.0.0',
  register: async (server, { service, musicService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(service, musicService, validator);
    server.route(routes(playlistsHandler));
  },
};
