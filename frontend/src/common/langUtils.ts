import {
  DESCRIPTIONS_JOINER,
  NOT_DEFINED_PLACEHOLDER,
} from '../const/langConst';
import Tags from 'language-tags';
import { LanguageInput } from '../generated/graphql';

// X_LANG_TAGS is an array of private (x-...) subtags; they are used as additional language tags to represent languages
// that are not present in the `language-tags` npm package (which refers to the IANA registry).
// List of main language tags we get from the `language-tags` library will be extended with these x- tags.
const X_LANG_TAGS: Array<TLang> = [
  { tag: 'x-Senga', descriptions: ['Senga'] },
  { tag: 'x-Fungwe', descriptions: ['Fungwe'] },
  { tag: 'x-Tambo', descriptions: ['Tambo'] },
  { tag: 'x-Wandya', descriptions: ['Wandya'] },
  { tag: 'x-Lungu', descriptions: ['Lungu'] },
  { tag: 'x-Chikunda', descriptions: ['Chikunda'] },
  { tag: 'x-Kabdende', descriptions: ['Kabdende'] },
  { tag: 'x-Shila', descriptions: ['Shila'] },
  { tag: 'x-Mwenyi', descriptions: ['Mwenyi'] },
  { tag: 'x-Liuwa', descriptions: ['Liuwa'] },
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
    dialect_code: langInfo.dialect?.tag,
    geo_code: langInfo.region?.tag,
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
