alter table translated_maps add column if not exists to_retranslate boolean ;
alter table translated_maps add column if not exists is_retranslating_now boolean;