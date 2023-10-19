import { NOT_DEFINED_PLACEHOLDER } from '../constants';
import { IDefinition, ITagInfo } from '../types';

export const sortSiteTextFn = (d1: IDefinition, d2: IDefinition) => {
  if (
    d1.siteTextlikeString &&
    d2.siteTextlikeString &&
    d1.siteTextlikeString.toLowerCase() > d2.siteTextlikeString.toLowerCase()
  ) {
    return 1;
  }

  if (
    d1.siteTextlikeString &&
    d2.siteTextlikeString &&
    d1.siteTextlikeString.toLowerCase() < d2.siteTextlikeString.toLowerCase()
  ) {
    return -1;
  }
  return 0;
};

export const sortTagInfosFn = (t1: ITagInfo, t2: ITagInfo) => {
  if (t1.descriptions && t1.descriptions[0] === NOT_DEFINED_PLACEHOLDER) {
    return -1;
  }
  if (t2.descriptions && t2.descriptions[0] === NOT_DEFINED_PLACEHOLDER) {
    return 1;
  }
  if (
    t1.descriptions &&
    t2.descriptions &&
    t1.descriptions[0] > t2.descriptions[0]
  ) {
    return 1;
  }
  if (
    t1.descriptions &&
    t2.descriptions &&
    t1.descriptions[0] < t2.descriptions[0]
  ) {
    return -1;
  }
  return 0;
};
