import { IDefinition, ITagInfo, LanguageInfo, LanguageInput, TDialect, TLang, TRegion } from "./types";

import Tags from 'language-tags';
export const DESCRIPTIONS_JOINER = '/';
export const NOT_DEFINED_PLACEHOLDER = '- not defined -';
export const LOADING_TAG_PLACEHOLDER = {
  tag: 'loading',
  descriptions: ['Loading data...'],
} as TDialect & TRegion & TLang;



// X_LANG_TAGS is an array of private (x-...) subtags; they are used as additional language tags to represent languages
// that are not present in the `language-tags` npm package (which refers to the IANA registry).
// List of main language tags we get from the `language-tags` library will be extended with these x- tags.
export const X_LANG_TAGS: Array<TLang> = [
  { tag: 'x-senga', descriptions: ['Senga'] },
  { tag: 'x-fungwe', descriptions: ['Fungwe'] },
  { tag: 'x-tambo', descriptions: ['Tambo'] },
  { tag: 'x-wandya', descriptions: ['Wandya'] },
  { tag: 'x-lungu', descriptions: ['Lungu'] },
  { tag: 'x-chikunda', descriptions: ['Chikunda'] },
  { tag: 'x-kabdende', descriptions: ['Kabdende'] },
  { tag: 'x-shila', descriptions: ['Shila'] },
  { tag: 'x-mwenyi', descriptions: ['Mwenyi'] },
  { tag: 'x-liuwa', descriptions: ['Liuwa'] },
  // { tag: 'x-Lambya', descriptions: ['Lambya'] },
  // { tag: 'x-Mukulu', descriptions: ['Mukulu'] },
  // { tag: 'x-Kunda', descriptions: ['Kunda'] },
];

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

  // if (X_LANG_TAGS.findIndex(xTtag => xTtag.tag===tagGiven_ ){

  // }
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

export const langInfo2langInput = (langInfo: LanguageInfo): LanguageInput => {
  return {
    language_code: langInfo.lang.tag,
    dialect_code: langInfo.dialect?.tag || null,
    geo_code: langInfo.region?.tag || null,
  };
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
    const langs: Array<TLang> = [...X_LANG_TAGS];
    const dialects: Array<TDialect> = [
      { tag: null, descriptions: [NOT_DEFINED_PLACEHOLDER] },
    ];
    const regions: Array<TRegion> = [
      { tag: null, descriptions: [NOT_DEFINED_PLACEHOLDER] },
    ];

    for (const currTag of allTags) {
      if (enabledTags && !enabledTags.includes(currTag.format())) {
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

export const subTags2Tag = ({
  lang,
  region,
  dialect,
}: {
  lang: string;
  region?: string;
  dialect?: string;
}): string => {
  let langTag = lang;
  region && (langTag += '-' + region);
  dialect && (langTag += '-' + dialect);
  return Tags(langTag).format();
};

export const languageInput2tag = (languageInput: LanguageInput): string => {
  return subTags2Tag({
    lang: languageInput.language_code,
    dialect: languageInput.dialect_code || undefined,
    region: languageInput.geo_code || undefined,
  });
};


(async function test() {
  const lngs = await getLangsRegistry();
  for (const xName of [
    'Senga',
    'Fungwe',
    'Lambya',
    'Tambo',
    'Wandya',
    'Lungu',
    'Kunda',
    'Chikunda',
    'Mukulu',
    'Kabdende',
    'Shila',
    'Mwenyi',
    'Liuwa',
  ]) {
    const found = lngs.langs.findIndex((l) => {
      for (const description of l.descriptions!) {
        if (description.includes(xName)) {
          return true;
        }
      }
    });

    if (found < 0) {
      console.log('absent:', xName);
    } else {
      console.log(lngs.langs[found]);
    }
  }
});
