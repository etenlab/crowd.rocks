type TVotes = {
  up: number;
  down: number;
};

type TWord = TLangCodes & {
  id: number;
  content: string;
  description?: string;
};

type TWordTranslated = {
  word: TWord;
  translation?: { word: TWord } | undefined;
};

type TWordWithTranslations = {
  word: TWord;
  translationsVoted: Array<{
    word: TWord;
    votes: TVotes;
    description?: string;
  }>;
};
