DROP table if exists original_maps_votes;

CREATE TABLE
  original_maps_votes (
    maps_vote_id bigserial NOT NULL,
    user_id int8 NOT NULL,
    map_id int8 NOT NULL,
    vote bool NULL,
    last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT original_maps_votes_pkey PRIMARY KEY (maps_vote_id),
    CONSTRAINT original_maps_votes_user_id_word_id_key UNIQUE (user_id, map_id),
    CONSTRAINT words_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT words_votes_map_id_fkey FOREIGN KEY (map_id) REFERENCES original_maps (original_map_id)
  );

CREATE INDEX idx__map_id__original_maps_votes ON original_maps_votes USING btree (map_id);

DROP table if exists translated_maps_votes;

CREATE TABLE
  translated_maps_votes (
    maps_vote_id bigserial NOT NULL,
    user_id int8 NOT NULL,
    map_id int8 NOT NULL,
    vote bool NULL,
    last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT translated_maps_votes_pkey PRIMARY KEY (maps_vote_id),
    CONSTRAINT translated_maps_votes_user_id_word_id_key UNIQUE (user_id, map_id),
    CONSTRAINT words_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT words_votes_map_id_fkey FOREIGN KEY (map_id) REFERENCES translated_maps (translated_map_id)
  );

CREATE INDEX idx__map_id__translated_maps_votes ON translated_maps_votes USING btree (map_id);