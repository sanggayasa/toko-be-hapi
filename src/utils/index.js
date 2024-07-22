/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  name,
  cover_url,
  year,
  tags,
  created_at,
  updated_at,
}) => ({
  id,
  name,
  coverUrl: cover_url,
  year,
  tags,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapDBToModelMusic = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModel, mapDBToModelMusic };
