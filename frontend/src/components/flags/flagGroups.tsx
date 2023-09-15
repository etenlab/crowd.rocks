import { FlagType } from '../../generated/graphql';

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
