interface TagInfo {
  tag: string | null;
  descriptions?: Array<string>;
}

type Lang = Omit<TagInfo, 'tag'> & { tag: string }; // make tag mandatory for Lang tag
type Region = TagInfo;
type Dialect = TagInfo;

type LanguageInfo = {
  lang: Lang;
  dialect?: Dialect | undefined;
  region?: Region | undefined;
};
