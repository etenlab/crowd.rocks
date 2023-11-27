import { useEffect, useState } from 'react';

import { TranslatedTextItemStandard } from './TranslatedTextItemStandard';
import { TranslatedTextItemForm } from './TranslatedTextItemForm';

type Item = {
  text: string;
  description: string;
};

export type TranslatedTextItemProps = {
  saving?: boolean;
  error?: boolean;
  original: Item;
  translation?: Item;
  initFormData?: Item;
  onDetail(): void;
  onConfirm(translation: string, description: string): void;
  onCancel(): void;
  disabledDetail?: boolean;
};

export function TranslatedTextItem({
  saving,
  error,
  original,
  translation,
  initFormData,
  disabledDetail,
  onDetail,
  onConfirm,
  onCancel,
}: TranslatedTextItemProps) {
  const [isForm, setIsForm] = useState<boolean>(false);
  const [savingState, setSavingState] = useState<'start' | 'progress' | 'end'>(
    'end',
  );

  useEffect(() => {
    if (error) {
      setSavingState('end');
      return;
    }

    if (savingState === 'end') {
      return;
    }

    if (savingState === 'start' && saving === false) {
      return;
    }

    if (savingState === 'start' && saving === true) {
      setSavingState('progress');
      return;
    }

    if (savingState === 'progress' && saving) {
      return;
    }

    if (savingState === 'progress' && saving === false) {
      setSavingState('end');
      setIsForm(false);
      return;
    }
  }, [savingState, saving, error]);

  const handleClick = () => {
    setIsForm(true);
  };

  const handleConfirm = (translation: string, description: string) => {
    onConfirm(translation, description);
    setSavingState('start');
  };

  const handleCancel = () => {
    setIsForm(false);
    onCancel();
  };

  if (isForm) {
    return (
      <TranslatedTextItemForm
        original={original}
        initialFormData={initFormData || { text: '', description: '' }}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        saving={savingState !== 'end'}
      />
    );
  } else {
    return (
      <TranslatedTextItemStandard
        original={original}
        translation={translation}
        onDetail={onDetail}
        onClick={handleClick}
        disabledDetail={disabledDetail}
      />
    );
  }
}
