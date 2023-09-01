import {
  DESCRIPTIONS_JOINER,
  NOT_DEFINED_PLACEHOLDER,
} from '../const/langConst';
import Tags from 'language-tags';

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

enum TagTypes {
  LANGUAGE = 'language',
  REGION = 'region',
  DIALECT = 'variant',
}

export const tag2langInfo = (tagGiven: string): LanguageInfo => {
  const complexTag = Tags(tagGiven);

  const lang = complexTag.find(TagTypes.LANGUAGE);
  const region = complexTag.find(TagTypes.REGION);
  const dialect = complexTag.find(TagTypes.DIALECT);
  const langInfo: LanguageInfo = {
    lang: { tag: lang?.format() || '', descriptions: lang?.descriptions() },
  };
  if (region) {
    langInfo.region = {
      tag: region.format(),
      descriptions: region.descriptions(),
    };
  }
  if (dialect) {
    langInfo.dialect = {
      tag: dialect.format(),
      descriptions: dialect.descriptions(),
    };
  }
  return langInfo;
};

export const langInfo2tag = (
  langInfo: LanguageInfo | undefined,
): string | undefined => {
  if (!langInfo) return undefined;
  const { lang, region, dialect } = langInfo;
  let langTag = lang.tag;
  region?.tag && (langTag += '-' + region?.tag);
  dialect?.tag && (langTag += '-' + dialect?.tag);
  return Tags(langTag).format();
};

export const langInfo2String = (langInfo: LanguageInfo | undefined): string => {
  let res = langInfo?.lang.descriptions?.join(DESCRIPTIONS_JOINER);
  if (!res) return '';
  if (langInfo?.region?.descriptions) {
    res += ' ' + langInfo.region?.descriptions.join(DESCRIPTIONS_JOINER);
  }
  if (langInfo?.dialect?.descriptions) {
    res +=
      ', dialect:' + langInfo?.dialect?.descriptions.join(DESCRIPTIONS_JOINER);
  }
  return res;
};

export const subTags2LangInfo = ({
  lang,
  region,
  dialect,
}: {
  lang: string;
  region?: string;
  dialect?: string;
}): LanguageInfo => {
  let langTag = lang;
  region && (langTag += '-' + region);
  dialect && (langTag += '-' + dialect);
  langTag = Tags(langTag).format();
  return tag2langInfo(langTag);
};

export const compareLangInfo = (
  a: LanguageInfo | null | undefined,
  b: LanguageInfo | null | undefined,
): boolean => {
  if (a === b) return true; // case both null or both undefined
  if (!a || !b) return false; // case one of them null or undefined
  if (a.lang.tag !== b.lang.tag) {
    return false;
  }

  if (a.dialect?.tag !== b.dialect?.tag) {
    return false;
  }

  if (a.region?.tag !== b.region?.tag) {
    return false;
  }

  return true;
};

type LangsRegistry = {
  langs: Array<TLang>;
  dialects: Array<TDialect>;
  regions: Array<TRegion>;
};

enum TagSpecialDescriptions {
  PRIVATE_USE = 'Private use',
}

// make it async to test and prepare for possible language library change to async
export const getLangsRegistry = async (
  enabledTags?: string[],
): Promise<LangsRegistry> => {
  return new Promise((resolve) => {
    const allTags = Tags.search(/.*/);
    const langs: Array<TLang> = [];
    const dialects: Array<TDialect> = [
      { tag: null, descriptions: [NOT_DEFINED_PLACEHOLDER] },
    ];
    const regions: Array<TRegion> = [
      { tag: null, descriptions: [NOT_DEFINED_PLACEHOLDER] },
    ];

    const strEnabledTags = enabledTags ? enabledTags.join(',') : null;

    for (const currTag of allTags) {
      if (
        strEnabledTags !== null &&
        !strEnabledTags.includes(currTag.format())
      ) {
        continue;
      }

      if (
        currTag.deprecated() ||
        currTag.descriptions().includes(TagSpecialDescriptions.PRIVATE_USE)
      ) {
        continue;
      }

      if (currTag.type() === TagTypes.LANGUAGE) {
        langs.push({
          tag: currTag.format(),
          descriptions: currTag.descriptions(),
        });
      }
      if (currTag.type() === TagTypes.REGION) {
        regions.push({
          tag: currTag.format(),
          descriptions: currTag.descriptions(),
        });
      }
      if (currTag.type() === TagTypes.DIALECT) {
        dialects.push({
          tag: currTag.format(),
          descriptions: currTag.descriptions(),
        });
      }
    }
    langs.sort(sortTagInfosFn);
    dialects.sort(sortTagInfosFn);
    regions.sort(sortTagInfosFn);

    resolve({
      langs,
      dialects,
      regions,
    });
  });
};
