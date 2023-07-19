type TWord = TLangCodes & {
  id: number;
  content: string;
};

type TWordWithTranslations = {
  word: TWord;
  translations: Array<TWord>;
};
