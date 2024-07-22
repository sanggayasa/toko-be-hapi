/* eslint-disable no-underscore-dangle */
class ExportsHandler {
  constructor(produserService, playlistsService, validator) {
    this._produserService = produserService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postExportPlaylistHandler(request, h) {
    console.log('masuk');
    this._validator.validateExportPlaylistPayload(request.payload);
    const { playlistId } = request.params;
    const userId = request.auth.credentials.id;
    const message = {
      userId,
      targetEmail: request.payload.targetEmail,
      playlistId,
    };
    // console.log(message);
    await this._playlistsService.getPlaylistsSongs(playlistId, userId);
    await this._produserService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
