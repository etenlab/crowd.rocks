type TMap = TLangCodes & {
  id: number;
  name: string;
  createdAt: Date;
  createdByUserId?: number;
};

type TMapWithContent = TMap & {
  content: string;
};

type TMapList = TMap[];
type TMapWithContentList = TMapWithContent[];

type TMapWord = {
  id: number;
  mapId: number;
  content: string;
};

type TMapWords = TMapWord[];
