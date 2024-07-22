/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5 ) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async addPlaylistSongs({ id: playlistId, songId, credentialId }) {
    await this.verifyPlaylistOwner(playlistId, credentialId);
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $5 ) RETURNING id',
      values: [id, playlistId, songId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists() {
    const result = await this._pool.query('SELECT id, name, owner as username FROM playlists');
    return result.rows;
  }

  async getPlaylistsSongs(id, credentialId) {
    const queryCheckSongInplaylist = {
      text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1',
      values: [id],
    };
    const resultSongsInPlaylist = await this._pool.query(queryCheckSongInplaylist);

    if (!resultSongsInPlaylist.rows.length) {
      throw new NotFoundError('songs tidak ditemukan');
    }

    await this.verifyPlaylistOwner(id, credentialId);
    const queryInfoPlaylist = {
      text: 'SELECT * FROM playlists INNER JOIN users ON users.id = playlists.owner WHERE playlists.id = $1 AND playlists.owner = $2  ',
      values: [id, credentialId],
    };
    const resultHeaderSongs = await this._pool.query(queryInfoPlaylist);

    if (!resultHeaderSongs.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    }

    const queryPlaylistSongs = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlist_songs INNER JOIN songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id= $1 ',
      values: [id],
    };
    const result = await this._pool.query(queryPlaylistSongs);

    return {
      id: resultHeaderSongs.rows[0].id,
      name: resultHeaderSongs.rows[0].name,
      username: resultHeaderSongs.rows[0].username,
      songs: result.rows,
    };
  }

  async deletePlaylistSongById(id, songId, credentialId) {
    await this.verifyPlaylistOwner(id, credentialId);
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [id, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async deletePlaylistById(id, credentialId) {
    await this.verifyPlaylistOwner(id, credentialId);
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, credentialId) {
    const queryVerifyOwnerPlaylist = {
      text: 'SELECT * FROM playlists WHERE id = $1 AND owner = $2  ',
      values: [id, credentialId],
    };
    const resultVerify = await this._pool.query(queryVerifyOwnerPlaylist);

    if (!resultVerify.rows.length) {
      throw new AuthorizationError('playlist tidak cocok dengan owner');
    }
  }
}

module.exports = PlaylistsService;
