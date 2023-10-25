import { useEffect, useState } from 'react';

import { WordItemStandard } from './WordItemStandard';
import { WordItemForm } from './WordItemForm';

type Item = {
  word: string;
  description: string;
};

export type WordItemProps = {
  saving?: boolean;
  error?: boolean;
  original: Item;
  translation?: Item;
  initFormData?: Item;
  onDetail(): void;
  onConfirm(translation: string, description: string): void;
  onCancel(): void;
};

export function WordItem({
  saving,
  error,
  original,
  translation,
  initFormData,
  onDetail,
  onConfirm,
  onCancel,
}: WordItemProps) {
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
      <WordItemForm
        original={original}
        initialFormData={initFormData || { word: '', description: '' }}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        saving={savingState !== 'end'}
      />
    );
  } else {
    return (
      <WordItemStandard
        original={original}
        translation={translation}
        onDetail={onDetail}
        onClick={handleClick}
      />
    );
  }
}
