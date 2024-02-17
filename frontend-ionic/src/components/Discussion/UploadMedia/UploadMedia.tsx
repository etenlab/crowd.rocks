import { styled } from 'styled-components';
import { FileUploadBtn } from '../../common/FileUploadBtn/FileUploadBtn';
import { cloudUploadOutline } from 'ionicons/icons';

type MediaUploadProps = {
  onSave: (file: File) => void;
  accept: 'video/*' | 'audio/*';
};

export const UploadMedia = ({ onSave, accept }: MediaUploadProps) => {
  return (
    <StyledUpload>
      <h2>Or upload...</h2>
      <div style={{ marginTop: '20px', marginLeft: '10px' }}>
        <FileUploadBtn
          accept={accept}
          onSelect={onSave}
          icon={cloudUploadOutline}
        />
      </div>
    </StyledUpload>
  );
};

const StyledUpload = styled.div`
  font-size: 30px;
  margin-top: 20px;
  margin-left: 20px;
  width: 100%;
  display: flex;
`;
