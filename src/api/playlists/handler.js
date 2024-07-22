/* eslint-disable no-underscore-dangle */
class PlaylistsHandler {
  constructor(service, musicService, validator) {
    this._service = service;
    this._musicService = musicService;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist({
      name, owner: credentialId,
    });
    const response = h.response({
      status: 'success',
      message: 'playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler() {
    const playlists = await this._service.getPlaylists();
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getPlaylistSongsByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const playlist = await this._service.getPlaylistsSongs(id, credentialId);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._musicService.getMusicById(songId);
    const playlistSongId = await this._service.addPlaylistSongs({
      id, songId, credentialId,
    });
    const response = h.response({
      status: 'success',
      message: 'playlist berhasil ditambahkan',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }

  async deletePlaylistSongByIdHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;
    await this._service.deletePlaylistSongById(id, songId, credentialId);
    return {
      status: 'success',
      message: 'playlist berhasil dihapus',
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._service.deletePlaylistById(id, credentialId);
    return {
      status: 'success',
      message: 'playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
