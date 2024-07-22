/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // memberikan constraint foreign key pada kolom playlist-songs_id
  // dan song_id terhadap playlist-songs.id dan songs.id
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_song.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
  pgm.addConstraint('playlists', 'fk_playlists.owner_id_owner.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('songs', 'fk_songs.album_id_album.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist-songs.playlist_id_playlist.id');
  pgm.dropConstraint('playlist_songs', 'fk_playlist-songs.song_id_song.id');
  pgm.dropConstraint('songs', 'fk_songs.album_id_album.id');
};
