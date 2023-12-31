import { IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useRef } from 'react';
import { styled } from 'styled-components';

export type FileUploadProps = {
  accept: string;
  onSelect: (file: File) => void;
  icon?: string;
};

export const FileUploadBtn = ({ accept, onSelect, icon }: FileUploadProps) => {
  const fileInput = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input
        ref={fileInput}
        hidden
        type="file"
        accept={accept}
        onChange={(e) => {
          e.target?.files && onSelect(e.target.files[0]);
        }}
      />
      <StIonIcon
        icon={icon ?? add}
        onClick={() => {
          fileInput?.current?.click();
        }}
      />
    </>
  );
};

const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
}));
