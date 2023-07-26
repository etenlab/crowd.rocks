type TVotes = {
  up: number;
  down: number;
};

type TWord = TLangCodes & {
  id: string;
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
