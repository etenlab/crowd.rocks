import { useCallback, useState } from 'react';
import { Item } from '../../common/TranslatedTextItem/TranslatedTextItemViewer';
import { TranslatedTextItem } from '../../common/TranslatedTextItem';
import { useHistory, useParams } from 'react-router';
import { useIonToast } from '@ionic/react';
import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { langInfo2langInput } from '../../../../../utils';
import { useAddPericopeTrMutation } from '../../../hooks/useAddPericopeTrMutation';

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
  const {
    states: {
      global: {
        langauges: {
          documentPage: { target: targetLang },
        },
      },
    },
  } = useAppContext();
  const [present] = useIonToast();
  const { tr } = useTr();

  const handleDetail = () => {
    history.push(
      `/${nation_id}/${language_id}/${cluster_id}/pericope-translations/pericope/${pericopeId}`,
    );
  };

  const [addPericopeTr] = useAddPericopeTrMutation();

  const handleConfirm = useCallback(
    async (translation: string, tanslation_description: string) => {
      if (!targetLang) {
        present({
          message: tr('Target language is not defined'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        return;
      }
      setSaving(true);
      await addPericopeTr({
        variables: {
          pericopeId,
          tanslation_description,
          translation,
          targetLang: langInfo2langInput(targetLang),
        },
      });
      setSaving(false);
    },
    [addPericopeTr, pericopeId, present, targetLang, tr],
  );

  const handleCancel = () => {};

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
