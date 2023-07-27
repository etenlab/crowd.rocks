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
  translationsVoted: Array<{
    word: TWord;
    votes: TVotes;
    definition?: string;
  }>;
};
