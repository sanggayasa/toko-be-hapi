/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(serviceUpload, serviceAlbum, validator) {
    this._serviceUpload = serviceUpload;
    this._serviceAlbum = serviceAlbum;
    this._validator = validator;
  }

  async postUploadImageHandler(request, h) {
    try {
      const { cover } = request.payload;
      console.log(cover.hapi.headers);
      const { id } = request.params;
      this._validator.validateImageHeaders(cover.hapi.headers);
      const filename = await this._serviceUpload.writeFile(cover, cover.hapi);
      await this._serviceAlbum.addImage(id, `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`);
      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = UploadsHandler;
