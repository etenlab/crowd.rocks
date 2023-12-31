import { useRef, ReactNode } from 'react';

export type FileUploadProps = {
  accept: string;
  onSelect: (file: File) => void;
  component?: ReactNode;
};

export function FileUpload({ accept, onSelect, component }: FileUploadProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);

  return (
    <div
      onClick={() => {
        fileInput?.current?.click();
      }}
      style={{ width: '100%' }}
    >
      <input
        ref={fileInput}
        hidden
        type="file"
        accept={accept}
        onChange={(e) => {
          if (!e.target?.files) return;
          onSelect(e.target.files[0]);
          e.target.value = '';
        }}
      />
      {component}
    </div>
  );
}
