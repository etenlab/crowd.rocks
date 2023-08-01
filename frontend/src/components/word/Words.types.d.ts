type TVotes = {
  upVotes: number;
  downVotes: number;
};

type TWord = TLangCodes & {
  id: string;
  content: string;
  definition?: string;
};

type TWordWithVotes = TWord & TVotes;

type TWordTranslated = {
  word: TWord;
  translation?: TWordWithVotes | undefined;
};

type TWordWithTranslations = {
  word: TWord;
  translations: Array<TWordWithVotes>;
};
