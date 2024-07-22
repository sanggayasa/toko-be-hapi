/* eslint-disable no-underscore-dangle */
class MusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postMusicHandler(request, h) {
    this._validator.validateMusicPayload(request.payload);
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;
    const songId = await this._service.addMusic({
      title, year, genre, performer, duration, albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'Music berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getMusicsHandler() {
    const songs = await this._service.getMusics();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getMusicByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getMusicById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putMusicByIdHandler(request) {
    this._validator.validateMusicPayload(request.payload);
    const { id } = request.params;

    await this._service.editMusicById(id, request.payload);

    return {
      status: 'success',
      message: 'songs berhasil diperbarui',
    };
  }

  async deleteMusicByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteMusicById(id);
    return {
      status: 'success',
      message: 'songs berhasil dihapus',
    };
  }
}

module.exports = MusicHandler;
