import { ViewMode } from '../../documents/DocumentViewer/DocumentViewer';

import { SuperToolKind } from '../SuperDocumentViewerPage/ToolBox';
import { PericopeDocumentViewer } from '../../pericopies/PericopeDocumentViewer';
import { TaggingDocumentViewer } from '../../tagging/TaggingDocumentViewer';
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
      <PericopeDocumentViewer
        documentId={documentId}
        mode={mode}
        customScrollParent={customScrollParent}
      />
    );
  } else if (tool === SuperToolKind.Tagging) {
    return (
      <TaggingDocumentViewer
        documentId={documentId}
        mode={mode}
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
