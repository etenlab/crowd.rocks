CREATE OR REPLACE PROCEDURE password_reset(
    IN p_token VARCHAR(64),
    in p_new_token varchar(64),
    IN p_password VARCHAR(50),
    inout p_email varchar(255),
    inout p_avatar varchar(64),
    inout p_user_id bigint,
    inout p_url varchar(128),
    INOUT error_type VARCHAR(32)
)
LANGUAGE PLPGSQL
AS $$
DECLARE
BEGIN
    -- find token in db
    select user_id
    from reset_tokens
    into p_user_id
    where token = p_token
        and EXTRACT(EPOCH from(CURRENT_TIMESTAMP - created_at)) < 360000;

    -- update password
    if found then
        update users
        set password = p_password
        where user_id = p_user_id
        returning email
        into p_email;

        select avatar, url
        from avatars
        into p_avatar, p_url
        where user_id = p_user_id;

        insert into tokens("token", "user_id")
        values (p_new_token, p_user_id);

        error_type := 'NoError';

    else
        error_type := 'InvalidToken';
    end if;


END; $$;