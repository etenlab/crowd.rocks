import { ViewMode } from '../../documents/DocumentViewer/DocumentViewer';

import { SuperToolKind } from '../SuperDocumentViewerPage/ToolBox';
import { PericopeDocumentViewerV2 } from '../../pericopies/PericopeDocumentViewer';
import { TaggingDocumentViewerV2 } from '../../tagging/TaggingDocumentViewer';
import { QADocumentViewer } from '../../qa/QADocumentViewer';

type SuperDocumentViewerProps = {
  documentId: string;
  mode: ViewMode;
  tool: SuperToolKind;
  customScrollParent?: HTMLElement;
};

export function SuperDocumentViewer({
  documentId,
  mode,
  tool,
  customScrollParent,
}: SuperDocumentViewerProps) {
  if (tool === SuperToolKind.Pericope) {
    return (
      <PericopeDocumentViewerV2
        documentId={documentId}
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
      <QADocumentViewer
        documentId={documentId}
        mode={mode}
        customScrollParent={customScrollParent}
      />
    );
  }
  return null;
}
