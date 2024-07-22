/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // memberikan constraint foreign key pada kolom playlist-songs_id
  // dan song_id terhadap playlist-songs.id dan songs.id
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
  pgm.addConstraint('user_album_likes', 'nama_constraint_unik_kolom1_kolom2', {
    unique: ['user_id', 'album_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.user_id_user.id');
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.salbum_id_albums.id');
};
