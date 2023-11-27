import { useCallback, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Stack, Typography } from '@mui/material';
import { useDebounce } from 'use-debounce';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { SearchInput } from '../../common/forms/SearchInput';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { useGetAllDocumentsLazyQuery } from '../../../generated/graphql';

import { PAGE_SIZE } from '../../../const/commonConst';
import { DocumentList } from '../../documents/DocumentList';

export function PericopeTrDocumentListPage() {
  const { tr } = useTr();
  const history = useHistory();
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const {
    states: {
      global: {
        langauges: { sourceLang },
      },
    },
  } = useAppContext();

  const [getAllDocuments, { data }] = useGetAllDocumentsLazyQuery();

  const [filter, setFilter] = useState<string>('');
  const [bouncedFilter] = useDebounce(filter, 500);

  useEffect(() => {
    if (sourceLang) {
      getAllDocuments({
        variables: {
          input: {
            filter: bouncedFilter.trim(),
            language_code: sourceLang?.lang.tag,
            dialect_code: sourceLang?.dialect?.tag || null,
            geo_code: sourceLang?.region?.tag || null,
          },
          first: PAGE_SIZE,
          after: null,
        },
      });
    }
  }, [getAllDocuments, sourceLang, bouncedFilter]);

  const handleGoToPericopeTrList = useCallback(
    (documentId: string) => {
      history.push(
        `/${nation_id}/${language_id}/${cluster_id}/pericope-translations/for-document/${documentId}`,
      );
    },
    [cluster_id, history, language_id, nation_id],
  );

  return (
    <PageLayout>
      <Caption>{tr('Translation')}</Caption>

      <Stack gap="32px">
        <Stack gap="8px">
          <Typography variant="h3" color="dark">
            {`${data?.getAllDocuments.pageInfo.totalEdges || 0} ${tr(
              'documents found',
            )}`}
          </Typography>

          <SearchInput
            value={filter}
            onChange={setFilter}
            onClickSearchButton={() => {}}
            placeholder={tr('Search by document...')}
          />
        </Stack>
      </Stack>

      {sourceLang ? (
        <DocumentList
          onClickItem={handleGoToPericopeTrList}
          filter={bouncedFilter}
          language={sourceLang}
        />
      ) : null}
    </PageLayout>
  );
}
