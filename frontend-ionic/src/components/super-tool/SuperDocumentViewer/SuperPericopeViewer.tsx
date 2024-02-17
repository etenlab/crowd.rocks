import { SuperToolKind } from '../SuperDocumentViewerPage/ToolBox';

import { TaggingPericopeViewer } from '../../tagging/TaggingDocumentViewer';
import { QAPericopeViewer } from '../../qa/QADocumentViewer';
import { PericopeWithDocumentWordEntry } from '../../../generated/graphql';

type SuperPericopeViewerProps = {
  pericope: PericopeWithDocumentWordEntry;
  tool: SuperToolKind;
  customScrollParent?: HTMLElement;
};

export function SuperPericopeViewer({
  pericope,
  tool,
  customScrollParent,
}: SuperPericopeViewerProps) {
  if (tool === SuperToolKind.Tagging) {
    return (
      <TaggingPericopeViewer
        pericope={pericope}
        customScrollParent={customScrollParent}
      />
    );
  } else if (tool === SuperToolKind.QA) {
    return (
      <QAPericopeViewer
        pericope={pericope}
        customScrollParent={customScrollParent}
      />
    );
  }
  return null;
}
