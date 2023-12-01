import { FlagType } from '../../generated/graphql';
import { globals } from '../../services/globals';

export type FlagName = {
  label: string;
  flag: FlagType;
  role: 'admin-only' | 'any-user';
};

export const WORD_AND_PHRASE_FLAGS: FlagName[] = [
  {
    label: 'Fast Translation',
    flag: FlagType.FastTranslation,
    role: 'admin-only',
  },
];

export const PERICOPIES_FLAGS: FlagName[] = [
  {
    label: 'Fast Translation',
    flag: FlagType.FastTranslation,
    role: 'admin-only',
  },
];

export const MAPS_FLAGS: FlagName[] = [
  {
    label: 'Fast Translation',
    flag: FlagType.FastTranslation,
    role: 'admin-only',
  },
];

export const authorizedForAnyFlag = (arr: FlagName[]): boolean => {
  let allAdmin = true;
  arr.map((flag) => {
    if (flag.role !== 'admin-only') allAdmin = false;
  });
  return !(allAdmin && globals.get_user_id() !== 1);
};
