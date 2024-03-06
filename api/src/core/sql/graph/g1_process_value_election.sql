-- this function will process the key-value election of any
-- Value it is given. It will find the parent Key and count the votes
create or replace procedure g1_process_value_election(
  p_entity_id bigint, -- a Value entity
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_parent_id bigint;
  v_parent_of_key bigint;
  v_props_of_key jsonb;
  v_g2_entity_type_of_key g1_entity_types;
  v_winning_value_id bigint;
  v_winning_value_props jsonb;
begin
  p_error_type := 'UnknownError';

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


  p_error_type := 'NoError';

end; $$;