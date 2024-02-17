import React, { PropsWithChildren, useRef } from 'react';
import Cropper from 'react-cropper';
import './cropper.css';

type CropperProps = {
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update_blob: (blob: any) => void;
};

export const CropperComp: React.FC<PropsWithChildren<CropperProps>> = (
  props,
) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageElement: any = cropperRef?.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cropper: any = imageElement?.cropper;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cropper.getCroppedCanvas().toBlob((blob: any) => {
      props.update_blob(blob);
    }, 'image/png');
  };

  return (
    <Cropper
      src={props.url}
      style={{ height: 400, width: '100%' }}
      // Cropper.js options
      initialAspectRatio={16 / 9}
      guides={false}
      crop={onCrop}
      ref={cropperRef}
    />
  );
};
