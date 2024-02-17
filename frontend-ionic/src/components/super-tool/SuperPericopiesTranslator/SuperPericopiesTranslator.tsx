import { PericopiesTrList } from '../../pericope-translations/PericopiesTrListPage/PericopiesTrList';
import { FilterKind } from '../SuperDocumentViewerPage/ToolBox';

type SuperPericopiesTranslator = {
  documentId: string;
  filterKind: FilterKind;
  stringFilter: string;
};

export function SuperPericopiesTranslator({
  documentId,
  filterKind,
  stringFilter,
}: SuperPericopiesTranslator) {
  return (
    <>
      <PericopiesTrList
        documentId={documentId}
        filterKind={filterKind}
        stringFilter={stringFilter}
      />
    </>
  );
}
