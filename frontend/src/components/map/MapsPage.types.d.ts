type TMap = {
  id: number;
  name: string;
  createdAt: Date;
  createdByUserId?: number;
};

type TMapWithContent = TMap & {
  content: string;
};

type TMapsList = TMap[];
type TMapWithContentList = TMapWithContent[];
