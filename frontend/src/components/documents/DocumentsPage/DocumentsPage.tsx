import { useCallback, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Stack, Typography, Button } from '@mui/material';
import { useDebounce } from 'use-debounce';

import { PageLayout } from '../../common/PageLayout';
import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { AddCircle } from '../../common/icons/AddCircle';
import { SearchInput } from '../../common/forms/SearchInput';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';
import { useGetAllDocumentsLazyQuery } from '../../../generated/graphql';

import { DocumentUploadModal } from './DocumentUploadModal';

import { PAGE_SIZE } from '../../../const/commonConst';
import { DocumentList } from '../../common/DocumentList';

export function DocumentsPage() {
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
    actions: { setSourceLanguage, createModal },
  } = useAppContext();

  const [getAllDocuments, { data }] = useGetAllDocumentsLazyQuery();

  const [filter, setFilter] = useState<string>('');
  const [bouncedFilter] = useDebounce(filter, 500);

  const { openModal, closeModal } = createModal();

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

  const handleGoToDocumentViewer = useCallback(
    (documentId: string) => {
      history.push(
        `/${nation_id}/${language_id}/${cluster_id}/documents/${documentId}`,
      );
    },
    [cluster_id, history, language_id, nation_id],
  );

  const handleOpenModal = () => {
    openModal(<DocumentUploadModal onClose={closeModal} />);
  };

  return (
    <PageLayout>
      <Caption>{tr('Documents')}</Caption>

      <Stack gap="32px">
        <LangSelector
          title={tr('Select your language')}
          selected={sourceLang}
          onChange={(_sourceLangTag, sourceLangInfo) => {
            setSourceLanguage(sourceLangInfo);
          }}
          onClearClick={() => setSourceLanguage(null)}
        />

        <Stack gap="8px">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h3" color="dark">
              {`${data?.getAllDocuments.pageInfo.totalEdges || 0} ${tr(
                'documents found',
              )}`}
            </Typography>

            <Button
              variant="contained"
              color="orange"
              sx={{ padding: '7px', minWidth: 0 }}
              onClick={handleOpenModal}
            >
              <AddCircle sx={{ fontSize: '18px' }} />
            </Button>
          </Stack>

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
          onClickItem={handleGoToDocumentViewer}
          filter={bouncedFilter}
          language={sourceLang}
        />
      ) : null}
    </PageLayout>
  );
}
