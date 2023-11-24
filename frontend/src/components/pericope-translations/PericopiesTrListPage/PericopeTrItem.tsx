import { useState } from 'react';
import { Item } from '../../common/WordItem/WordItemViewer';
import { WordItem } from '../../common/WordItem';

type TPericopeItemParams = {
  original: Item;
  translation?: Item;
};

export function PericopeTrItem({ original, translation }: TPericopeItemParams) {
  const [saving, setSaving] = useState<boolean>(false);

  const handleDetail = () => {
    console.log('handleDetail');
  };
  const handleConfirm = (translation: string, description: string) => {
    setSaving(true);
    console.log('handleConfirm', translation, description);
  };

  const handleCancel = () => {
    console.log('handleCancel');
  };

  return (
    <WordItem
      original={{
        word: original.word,
        description: original.description,
      }}
      translation={translation || undefined}
      onConfirm={(translation, description) => {
        handleConfirm(translation, description);
      }}
      onDetail={handleDetail}
      onCancel={handleCancel}
      saving={saving}
    />
  );
}
