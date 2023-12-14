import { SuperToolKind } from '../SuperDocumentViewerPage/ToolBox';
import { PericopeDocumentViewerV2 } from '../../pericopies/PericopeDocumentViewer';
import { TaggingDocumentViewerV2 } from '../../tagging/TaggingDocumentViewer';
import { QADocumentViewerV2 } from '../../qa/QADocumentViewer';

type SuperDocumentViewerProps = {
  documentId: string;
  documentAuthorId: string;
  tool: SuperToolKind;
  customScrollParent?: HTMLElement;
};

export function SuperDocumentViewer({
  documentId,
  documentAuthorId,
  tool,
  customScrollParent,
}: SuperDocumentViewerProps) {
  if (tool === SuperToolKind.Pericope) {
    return (
      <PericopeDocumentViewerV2
        documentId={documentId}
        documentAuthorId={documentAuthorId}
        customScrollParent={customScrollParent}
      />
    );
  } else if (tool === SuperToolKind.Tagging) {
    return (
      <TaggingDocumentViewerV2
        documentId={documentId}
        customScrollParent={customScrollParent}
      />
    );
  } else if (tool === SuperToolKind.QA) {
    return (
      <QADocumentViewerV2
        documentId={documentId}
        customScrollParent={customScrollParent}
      />
    );
  }
  return null;
}
