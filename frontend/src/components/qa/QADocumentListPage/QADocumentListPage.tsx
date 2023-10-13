import { useCallback } from 'react';
import { useParams, useHistory } from 'react-router';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';

import { DocumentList } from '../../documents/DocumentList/DocumentList';
import {
  CaptionContainer,
  FilterContainer,
  ListCaption,
} from '../../common/styled';
import { RowStack } from '../../common/Layout/styled';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

export function QADocumentListPage() {
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: { sourceLang },
      },
    },
    actions: { setSourceLanguage },
  } = useAppContext();
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();
  const history = useHistory();

  const handleGoToDocumentViewer = useCallback(
    (documentId: string) => {
      history.push(
        `/${nation_id}/${language_id}/${cluster_id}/qa/documents/${documentId}`,
      );
    },
    [cluster_id, history, language_id, nation_id],
  );

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Question & Answer')}</Caption>
      </CaptionContainer>
      <FilterContainer>
        <LangSelector
          title={tr('Select language')}
          selected={sourceLang}
          onChange={(_sourceLangTag, sourceLangInfo) => {
            setSourceLanguage(sourceLangInfo);
          }}
          onClearClick={() => setSourceLanguage(null)}
        />
      </FilterContainer>

      <RowStack>
        <ListCaption>{tr('Document List')}</ListCaption>
      </RowStack>

      <DocumentList onClickItem={handleGoToDocumentViewer} />
    </PageLayout>
  );
}
