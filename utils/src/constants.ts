import { TDialect, TLang, TRegion } from './types';

export const DESCRIPTIONS_JOINER = '/';
export const NOT_DEFINED_PLACEHOLDER = '- not defined -';
export const LOADING_TAG_PLACEHOLDER = {
  tag: 'loading',
  descriptions: ['Loading data...'],
} as TDialect & TRegion & TLang;
