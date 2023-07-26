type TMap = {
  id: string;
  name: string;
  createdAt: string;
  createdByUserId?: string;
};

type TMapWithContent = TMap & {
  content: string;
};

type TMapsList = TMap[];
type TMapWithContentList = TMapWithContent[];
