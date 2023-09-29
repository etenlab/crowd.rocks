import { useTr } from '../../../hooks/useTr';
import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';

import { DocumentList } from '../../documents/DocumentList/DocumentList';

export function QADocumentListPage() {
  const { tr } = useTr();

  return (
    <PageLayout>
      <Caption>{tr('Question & Answer')}</Caption>
      <p>{tr('Document List')}</p>

      <DocumentList />
    </PageLayout>
  );
}
