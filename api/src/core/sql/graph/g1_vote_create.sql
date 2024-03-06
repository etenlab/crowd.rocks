--                  Active    Inactive
--  Node            X         X
--  Relationship    X         X
--  Key             X         X
--  Value                    
--


create or replace procedure g1_vote_create(
  in p_user_id bigint,
  in p_entity_id bigint,
  in p_vote bool,
  inout p_g1_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_type g1_entity_types;
  v_old_votes int;
  v_votes_true int;
  v_votes_false int;
  v_vote_total int;
  v_parent_id int;
  v_parent_type g1_entity_types;
  v_key_name varchar;
  v_winning_value_id bigint;
  v_parent_of_key bigint;
  v_props_of_key jsonb;
  v_g2_entity_type_of_key g1_entity_types;
  v_winning_value_props jsonb;

begin
  p_error_type := 'UnknownError';

  -- get the type of the entity, which also checks for existence
  select entity_type
  into v_type
  from g1_entities
  where entity_id = p_entity_id;

  if v_type is null then
    p_error_type := 'EntityDoesNotExist';
    return;
  end if;

  -- add the vote, overwriting any existing vote
  insert into g1_votes(user_id, entity_id, vote)
  values (p_user_id, p_entity_id, p_vote)
  on conflict (user_id, entity_id) do update set vote = excluded.vote
  returning g1_vote_id 
  into p_g1_vote_id;

  if p_g1_vote_id is null then
    return;
  end if;

  -- store the old vote
  select votes
  into v_old_votes
  from g1_entities
  where entity_id = p_entity_id;

  -- based on the type, update the vote count
  -- Value type
  if v_type = 'Value'::g1_entity_types then 

    select count(g1_vote_id)
    into v_votes_true
    from g1_votes
    where 
          entity_id = p_entity_id
      and vote = true;

    update g1_entities
    set votes = v_votes_true
    where entity_id = p_entity_id;

  -- Node, Relationship, and Key types
  else 

    select count(g1_vote_id)
    into v_votes_true
    from g1_votes
    where 
          entity_id = p_entity_id
      and vote = true;

    select count(g1_vote_id)
    into v_votes_false
    from g1_votes
    where 
          entity_id = p_entity_id
      and vote = false;

    v_vote_total := v_votes_true - v_votes_false;

    update g1_entities
    set votes = v_vote_total
    where entity_id = p_entity_id;

  end if;

  -- determine if this vote changes the outcome of an election
  -- Values are handled differently so we'll split on type first
  if v_type = 'Value'::g1_entity_types then

    -- Value entities only record the true votes and are compared
    -- to all other value entities for the same key
    -- determine if this value has won the election against the other
    -- values of the same key and update the g2 node/rel props

    -- find the parent Key
    select from_entity
    into v_parent_id
    from g1_entities
    where entity_id = p_entity_id;

    if v_parent_id is null then
      p_error_type := 'KeyParentOfValueNotFound';
      return;
    end if;

    -- find the parent Node/Relationship of the Key, and the key name
    select from_entity, props
    into v_parent_of_key, v_props_of_key
    from g1_entities
    where entity_id = v_parent_id and entity_type = 'Key'::g1_entity_types;

    if v_parent_of_key is null then
      p_error_type := 'G2ParentOfValueNotFound';
      return;
    end if;   

    if v_props_of_key is null then
      p_error_type := 'KeyNameNotFound';
      return;
    end if;

    -- get type of key parent, whether Node or Relationship
    select entity_type
    into v_g2_entity_type_of_key
    from g1_entities
    where entity_id = v_parent_of_key
      and (
             entity_type = 'Node'::g1_entity_types
          or entity_type = 'Relationship'::g1_entity_types
      );

    if v_g2_entity_type_of_key is null then
      p_error_type := 'G1TypeOfParentOfKeyNotFound';
      return;
    end if;

    -- find winning value 
    select entity_id, props
    into v_winning_value_id, v_winning_value_props
    from g1_entities
    where from_entity = v_parent_id
    order by votes desc, entity_id asc
    limit 1;

    -- update the value of the g2 entity
    -- Node
    if v_g2_entity_type_of_key = 'Node'::g1_entity_types then

      update g2_nodes
      set props = props || jsonb_build_object(trim(both '"' from v_props_of_key::TEXT), v_winning_value_props)
      where entity_id = v_parent_of_key;

    -- Relationship
    elsif v_g2_entity_type_of_key = 'Relationship'::g1_entity_types then

      update g2_relationships
      set props = props || jsonb_build_object(trim(both '"' from v_props_of_key::TEXT), v_winning_value_props)
      where entity_id = v_parent_of_key;
    
    end if;

  -- for Nodes, Relationships, and Keys
  else 

    -- Node, Relationship, and Key entities sum the true and false 
    -- votes which represent whether users believe they should exist
    -- or not, so they are not compared to any other entitie's vote like Values are. 
    -- A net positive vote means they exist, a net negative vote means they 
    -- don't make their way to a g2 node or relationship

    -- a deleted entity is now active
    if v_old_votes < 0 and v_vote_total >= 0 then 

      if v_type = 'Node'::g1_entity_types then

        update g2_nodes
        set active = true
        where entity_id = p_entity_id;

      elsif v_type = 'Relationship'::g1_entity_types then

        update g2_relationships
        set active = true
        where entity_id = p_entity_id;

      elsif v_type = 'Key'::g1_entity_types then

        -- find the parent node or relationships
        select from_entity
        into v_parent_id
        from g1_entities
        where entity_id = p_entity_id;

        if v_parent_id is null then
          p_error_type := 'ParentOfKeyNotFound';
          return;
        end if;

        select entity_type
        into v_parent_type
        from g1_entities
        where entity_id = v_parent_id;

        if v_parent_type is null then
          p_error_type := 'ParentTypeOfKeyNotFound';
          return;
        end if;

        -- get name of key so we can add it 
        select props
        into v_key_name
        from g1_entities
        where entity_id = p_entity_id;

        if v_key_name is null then
          p_error_type := 'KeyNameNotFound';
          return;
        end if;

        -- add the key to the node
        if v_parent_type = 'Node'::g1_entity_types then

          update g2_nodes
          set props = ('{'|| v_key_name || ':null}')::jsonb || props
          where entity_id = p_entity_id;

        -- add the key to the relationship
        elsif v_parent_type = 'Relationship'::g1_entity_types then

          update g2_relationships
          set props = ('{'|| v_key_name || ':null}')::jsonb || props
          where entity_id = p_entity_id;
        
        end if;

      end if;

    -- an active entity is now deleted
    elsif v_old_votes >= 0 and v_vote_total < 0 then
    
      -- mark the g2 node as inactive
      if v_type = 'Node'::g1_entity_types then

        update g2_nodes
        set active = false
        where entity_id = p_entity_id;
      
      -- mark the g2 relationship as inactive
      elsif v_type = 'Relationship'::g1_entity_types then
      
        update g2_relationships
        set active = false
        where entity_id = p_entity_id;
      
      -- remove the key from the node/relationship, determine which one
      elsif v_type = 'Key'::g1_entity_types then
      
        -- find the parent node or relationships
        select from_entity
        into v_parent_id
        from g1_entities
        where entity_id = p_entity_id;

        if v_parent_id is null then
          p_error_type := 'ParentOfKeyNotFound';
          return;
        end if;

        select entity_type
        into v_parent_type
        from g1_entities
        where entity_id = v_parent_id;

        if v_parent_type is null then
          p_error_type := 'ParentTypeOfKeyNotFound';
          return;
        end if;

        -- get name of key so we can remove it 
        select props
        into v_key_name
        from g1_entities
        where entity_id = p_entity_id;

        if v_key_name is null then
          p_error_type := 'KeyNameNotFound';
          return;
        end if;

        -- remove the key from the node
        if v_parent_type = 'Node'::g1_entity_types then

          update g2_nodes
          set props = props - v_key_name;

        -- remove the key from the relationship
        elsif v_parent_type = 'Relationship'::g1_entity_types then

          update g2_relationships
          set props = props - v_key_name;

        else
          raise notice 'parent id: % type: %', v_parent_id, v_parent_type;
          p_error_type := 'ParentTypeOfKeyNotProcessed';
          return;
        end if;

      end if;

    end if;

  end if;

  p_error_type := 'NoError';

end; $$;