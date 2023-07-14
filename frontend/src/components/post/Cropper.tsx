import React, { PropsWithChildren, useRef } from "react";
import Cropper from "react-cropper";
import "./cropper.css";

type CropperProps = {
  url: string;
  update_blob: (blob: any) => void;
};

export const CropperComp: React.FC<PropsWithChildren<CropperProps>> = (
  props
) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = async () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    cropper.getCroppedCanvas().toBlob((blob: any) => {
      props.update_blob(blob);
    }, "image/png");
  };

  return (
    <Cropper
      src={props.url}
      style={{ height: 400, width: "100%" }}
      // Cropper.js options
      initialAspectRatio={16 / 9}
      guides={false}
      crop={onCrop}
      ref={cropperRef}
    />
  );
};
