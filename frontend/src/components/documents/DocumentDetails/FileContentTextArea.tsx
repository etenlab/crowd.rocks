import { IonTextarea } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
interface IFileContentTextareaProps {
  src: string;
}

export const FileContentTextarea = ({ src }: IFileContentTextareaProps) => {
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    fetch(src)
      .then((response) => response.text())
      .then((data) => {
        setFileContent(data);
      })
      .catch((error) => {
        console.error('Error fetching file content:', error);
      });
  }, [src]);

  return (
    <FileTextarea
      placeholder="Type something here"
      autoGrow={true}
      value={fileContent}
      readonly
      fill="outline"
    ></FileTextarea>
  );
};

const FileTextarea = styled(IonTextarea)(() => ({}));
