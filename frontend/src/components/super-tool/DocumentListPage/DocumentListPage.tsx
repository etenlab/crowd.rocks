import { useCallback, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useIonToast } from '@ionic/react';
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

import { DocumentUploadModal } from '../../documents/DocumentsPage/DocumentUploadModal';

import { PAGE_SIZE } from '../../../const/commonConst';
import { DocumentList } from '../../documents/DocumentList';

export function DocumentListPage() {
  const { tr } = useTr();
  const history = useHistory();
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();
  const [toastPresent] = useIonToast();

  const {
    states: {
      global: {
        langauges: {
          documentPage: { source: sourceLang, target: targetLang },
        },
      },
    },
    actions: {
      changeDocumentSourceLanguage,
      changeDocumentTargetLanguage,
      createModal,
    },
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
      if (sourceLang && targetLang) {
        history.push(
          `/${nation_id}/${language_id}/${cluster_id}/super-tool/documents/${documentId}`,
        );
      } else {
        toastPresent({
          message: tr('Please select source and target languages'),
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
    [
      cluster_id,
      history,
      language_id,
      nation_id,
      sourceLang,
      targetLang,
      toastPresent,
      tr,
    ],
  );

  const handleOpenModal = () => {
    openModal(<DocumentUploadModal onClose={closeModal} />);
  };

  return (
    <PageLayout>
      <Caption>{tr('Super Tool')}</Caption>

      <Stack gap="32px">
        <Stack gap="16px">
          <LangSelector
            title={tr('Select source language')}
            selected={sourceLang}
            onChange={(_sourceLangTag, sourceLangInfo) => {
              changeDocumentSourceLanguage(sourceLangInfo);
            }}
            onClearClick={() => changeDocumentSourceLanguage(null)}
          />
          <LangSelector
            title={tr('Select target language')}
            selected={targetLang}
            onChange={(_targetLangTag, targetLangInfo) => {
              changeDocumentTargetLanguage(targetLangInfo);
            }}
            onClearClick={() => changeDocumentTargetLanguage(null)}
          />
        </Stack>

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
