CREATE OR REPLACE PROCEDURE verify_email(
    IN p_token VARCHAR(512),
    INOUT p_email varchar(255),
    inout p_avatar varchar(64),
    INOUT error_type VARCHAR(32)
)
LANGUAGE PLPGSQL
AS $$
DECLARE
    vUserId bigint;
    vType token_type;
BEGIN
    select user_id, type
    from email_tokens
    into vUserId
    where token = p_token;

    if found then

        if vType = 'Accept' then

            -- set email as verified
            update users
            set is_email_verified = true
            where user_id = vUserId;

            -- get email and avatar
            select email
            from users
            into p_email
            where user_id = vUserId;

            select avatar
            from avatars
            into p_avatar
            where user_id = vUserId;

            error_type := 'NoError';
        else

            select email
            from users
            into p_email
            where user_id = vUserId;

            insert into emails_blocked("email")
            values (p_email)
            on conflict do nothing;

            error_type := 'EmailIsBlocked';
        end if;
    else
        error_type := 'TokenNotFound';
    end if;

END; $$;