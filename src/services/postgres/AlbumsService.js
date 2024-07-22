/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbums({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, name, null, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('albums gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumsById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('album tidak ditemukan');
    }
    console.log(result.rows);
    return result.rows.map(mapDBToModel)[0];
  }

  async editNoteById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui albums. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addImage(id, coverUrl) {
    const updatedAt = new Date().toISOString();
    console.log(id);
    console.log(coverUrl);
    const query = {
      text: 'UPDATE albums SET cover_url = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [coverUrl, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('cover Url gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async addAlbumsLikes(albumId, credentialId) {
    const id = nanoid(16);
    const queryCheckAlbumExist = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };
    const resultCheckAlbumExist = await this._pool.query(queryCheckAlbumExist);

    if (!resultCheckAlbumExist.rows.length) {
      throw new NotFoundError('album tidak ditemukan');
    }
    try {
      const query = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, credentialId, albumId],
      };

      const result = await this._pool.query(query);
      console.log(result.rows.code);
      if (!result.rows[0].id) {
        throw new InvariantError('albums like gagal ditambahkan');
      }
      await this._cacheService.delete(`totalLike:${id}`);
      return result.rows[0].id;
    } catch (error) {
      throw new ClientError('albums sudah di sukai');
    }
  }

  async getAlbumsTotalLikeById(id) {
    try {
      const result = await this._cacheService.get(`totalLike:${id}`);
      console.log('ready di redis');
      return { total: +result, cache: true };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('album tidak ditemukan');
      }
      console.log(result.rows);
      const totalInt = +result.rows[0].count;
      // await this._cacheService.delete(`totalLike:${id}`);
      await this._cacheService.set(`totalLike:${id}`, JSON.stringify(totalInt));
      return { total: totalInt, cache: false };
    }
  }

  async deleteAlbumLikeById(id, credentialId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [id, credentialId],
    };

    const result = await this._pool.query(query);
    await this._cacheService.delete(`totalLike:${id}`);
    if (!result.rows.length) {
      throw new NotFoundError('album like gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
