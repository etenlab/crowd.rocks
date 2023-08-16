type TLangCodes = {
  languageCode: string;
  dialectCode?: string;
  geoCode?: string;
};

interface ITagInfo {
  tag: string | null;
  descriptions?: Array<string>;
}

interface IDefinition {
  siteTextId: string;
  isWord: boolean;
  siteTextlikeString: string;
  definitionlikeString: string;
}

type TLang = Omit<ITagInfo, 'tag'> & { tag: string }; // make tag mandatory for Lang tag
type TRegion = ITagInfo;
type TDialect = ITagInfo;

type LanguageInfo = {
  lang: TLang;
  dialect?: TDialect | undefined;
  region?: TRegion | undefined;
};
