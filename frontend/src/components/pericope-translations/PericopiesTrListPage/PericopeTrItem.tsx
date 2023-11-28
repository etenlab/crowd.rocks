import { useState } from 'react';
import { Item } from '../../common/TranslatedTextItem/TranslatedTextItemViewer';
import { TranslatedTextItem } from '../../common/TranslatedTextItem';
import { useHistory, useParams } from 'react-router';

type TPericopeItemParams = {
  original: Item;
  translation?: Item;
  pericopeId: string;
};

export function PericopeTrItem({
  original,
  translation,
  pericopeId,
}: TPericopeItemParams) {
  const [saving, setSaving] = useState<boolean>(false);
  const history = useHistory();
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const handleDetail = () => {
    history.push(
      `/${nation_id}/${language_id}/${cluster_id}/pericope-translations/pericope/${pericopeId}`,
    );
  };

  const handleConfirm = (translation: string, description: string) => {
    setSaving(true);
    console.log('handleConfirm', translation, description);
  };

  const handleCancel = () => {
    console.log('handleCancel');
  };

  return (
    <TranslatedTextItem
      original={{
        text: original.text,
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
