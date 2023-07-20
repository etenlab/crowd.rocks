type TVotes = {
  up: number;
  down: number;
};

type TWord = TLangCodes & {
  id: number;
  content: string;
};

type TWordTranslated = {
  word: TWord;
  translation: { word: TWord };
};

type TWordWithTranslations = {
  word: TWord;
  translationsVoted: Array<{
    word: TWord;
    votes: TVotes;
    description?: string;
  }>;
};
