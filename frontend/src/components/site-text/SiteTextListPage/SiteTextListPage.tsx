import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/components';

import {
  Stack,
  Button,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { useDebounce } from 'use-debounce';

import { Caption } from '../../common/Caption/Caption';
import { LangSelector } from '../../common/LangSelector/LangSelector';
import { SearchInput } from '../../common/forms/SearchInput';
import { FilterList } from '../../common/icons/FilterList';
import { AddCircle } from '../../common/icons/AddCircle';
import { NavigationModal } from '../../common/modalContent/NavigationModal';
import { Select, OptionItem } from '../../common/forms/Select';

import { useGetAllSiteTextDefinitionsLazyQuery } from '../../../generated/graphql';

import { ErrorType } from '../../../generated/graphql';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { NewSiteTextModal } from '../NewSiteTextModal';
import { TranslationItem } from '../../translation/TranslationItem';
import { OriginalData } from '../../translation/hooks/useTranslationTools';

import { subTags2LangInfo } from '../../../../../utils';
import { globals } from '../../../services/globals';
import { PageLayout } from '../../common/PageLayout';

import { PAGE_SIZE } from '../../../const/commonConst';

export function SiteTextListPage() {
  const { tr } = useTr();
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const {
    states: {
      global: {
        langauges: {
          siteTextStringPage: { target },
        },
      },
    },
    actions: { changeSiteTextTargetLanguage, createModal },
  } = useAppContext();

  const [filter, setFilter] = useState<string>('');
  const [bouncedFilter] = useDebounce(filter, 500);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quickFilter, setQuickFilter] = useState<string | null>('');
  const [filterOption, setFilterOption] = useState<OptionItem>({
    label: tr('All'),
    value: 'all',
  });

  const { openModal, closeModal } = createModal();

  const isAdminUser = globals.is_admin_user();

  const [getAllSiteTextDefinitions, { data, error, loading, fetchMore }] =
    useGetAllSiteTextDefinitionsLazyQuery();

  console.log(data);

  useEffect(() => {
    getAllSiteTextDefinitions({
      variables: {
        filter: bouncedFilter,
        quickFilter,
        onlyNotTranslated:
          filterOption.value === 'not translated' ? true : null,
        onlyTranslated: filterOption.value === 'translated' ? true : null,
        targetLanguage: target
          ? {
              language_code: target.lang.tag,
              dialect_code: target.dialect?.tag || null,
              geo_code: target.region?.tag || null,
            }
          : null,
        first: PAGE_SIZE,
        after: null,
      },
    });
  }, [
    getAllSiteTextDefinitions,
    bouncedFilter,
    quickFilter,
    filterOption.value,
    target,
  ]);

  const handleChangeFilterOption = useCallback((value: OptionItem | null) => {
    if (value) {
      setFilterOption(value);
    }
  }, []);

  const filterOptions = useMemo(
    () => [
      {
        label: tr('All'),
        value: 'all',
      },
      {
        label: tr('Translated'),
        value: 'translated',
      },
      {
        label: tr('Not Translated'),
        value: 'not translated',
      },
    ],
    [tr],
  );

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleOpenFilterModal = () => {
    openModal(
      <NavigationModal onClose={closeModal} setQuickFilter={setQuickFilter} />,
    );
  };

  const handleInfinite = useCallback(
    async (ev: IonInfiniteScrollCustomEvent<void>) => {
      if (data?.getAllSiteTextDefinitions.pageInfo.hasNextPage) {
        await fetchMore({
          variables: {
            first: PAGE_SIZE,
            after: data.getAllSiteTextDefinitions.pageInfo.endCursor,
            filter: filter.trim(),
          },
        });
      }

      setTimeout(() => ev.target.complete(), 500);
    },
    [fetchMore, filter, data],
  );

  const cardListComs = useMemo(() => {
    const originals: OriginalData[] = [];

    if (
      error ||
      !data ||
      data.getAllSiteTextDefinitions.error !== ErrorType.NoError
    ) {
      return null;
    }

    for (const edge of data.getAllSiteTextDefinitions.edges) {
      const siteTextDefinition = edge.node;

      switch (siteTextDefinition.__typename) {
        case 'SiteTextWordDefinition': {
          originals.push({
            isWord: true,
            wordOrPhrase: {
              id: siteTextDefinition.word_definition.word.word_id,
              likeString: siteTextDefinition.word_definition.word.word,
            },
            definition: {
              id: siteTextDefinition.word_definition.word_definition_id,
              likeString: siteTextDefinition.word_definition.definition,
            },
            author: {
              username:
                siteTextDefinition.word_definition.word.created_by_user.avatar,
              avatar:
                siteTextDefinition.word_definition.word.created_by_user
                  .avatar_url || undefined,
              createdAt: new Date(
                siteTextDefinition.word_definition.created_at,
              ),
              createdByBot:
                siteTextDefinition.word_definition.word.created_by_user.is_bot,
            },
            language: subTags2LangInfo({
              lang: siteTextDefinition.word_definition.word.language_code,
              dialect:
                siteTextDefinition.word_definition.word.dialect_code ||
                undefined,
              region:
                siteTextDefinition.word_definition.word.geo_code || undefined,
            }),
          });
          break;
        }
        case 'SiteTextPhraseDefinition': {
          originals.push({
            isWord: false,
            wordOrPhrase: {
              id: siteTextDefinition.phrase_definition.phrase.phrase_id,
              likeString: siteTextDefinition.phrase_definition.phrase.phrase,
            },
            definition: {
              id: siteTextDefinition.phrase_definition.phrase_definition_id,
              likeString: siteTextDefinition.phrase_definition.definition,
            },
            author: {
              username:
                siteTextDefinition.phrase_definition.phrase.created_by_user
                  .avatar,
              avatar:
                siteTextDefinition.phrase_definition.phrase.created_by_user
                  .avatar_url || undefined,
              createdAt: new Date(
                siteTextDefinition.phrase_definition.created_at,
              ),
              createdByBot:
                siteTextDefinition.phrase_definition.phrase.created_by_user
                  .is_bot,
            },
            language: subTags2LangInfo({
              lang: siteTextDefinition.phrase_definition.phrase.language_code,
              dialect:
                siteTextDefinition.phrase_definition.phrase.dialect_code ||
                undefined,
              region:
                siteTextDefinition.phrase_definition.phrase.geo_code ||
                undefined,
            }),
          });
          break;
        }
      }
    }

    return originals
      .sort((a, b) => {
        if (
          a.wordOrPhrase.likeString.toLowerCase() >
          b.wordOrPhrase.likeString.toLowerCase()
        ) {
          return 1;
        } else if (
          a.wordOrPhrase.likeString.toLowerCase() <
          b.wordOrPhrase.likeString.toLowerCase()
        ) {
          return -1;
        } else {
          return 0;
        }
      })
      .map((original) => (
        <TranslationItem
          key={`${original.isWord ? 'word' : 'phrase'}-${
            original.definition.id
          }`}
          original={original}
          targetLang={target}
          redirectUrl={`/${nation_id}/${language_id}/${cluster_id}/site-text-list`}
        />
      ));
  }, [cluster_id, data, error, language_id, nation_id, target]);

  const handleClickNewSiteTextButton = () => {
    openModal(<NewSiteTextModal onClose={closeModal} />);
  };

  return (
    <PageLayout>
      <Caption>{tr('Site Text Strings')}</Caption>

      <LangSelector
        title={tr('Select target language')}
        selected={target}
        onChange={(_targetLangTag, targetLangInfo) => {
          changeSiteTextTargetLanguage(targetLangInfo);
        }}
        onClearClick={() => changeSiteTextTargetLanguage(null)}
      />

      <Stack gap="16px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap="16px"
        >
          <Stack sx={{ flex: 1 }}>
            <Select
              placeholder={tr('Select sort filter')}
              options={filterOptions}
              value={filterOption}
              onChange={handleChangeFilterOption}
              onClear={() => {
                setFilterOption({
                  label: tr('All'),
                  value: 'all',
                });
              }}
            />
          </Stack>
          <Button
            variant="contained"
            onClick={handleOpenFilterModal}
            color="gray_bg"
            sx={{
              padding: '10px',
              minWidth: '0',
              border: (theme) => `1px solid ${theme.palette.text.gray_stroke}`,
            }}
          >
            <FilterList sx={{ fontSize: 22 }} />
          </Button>
          {isAdminUser ? (
            <Button
              variant="contained"
              color="gray_bg"
              sx={{
                padding: '10px',
                minWidth: 0,
                border: (theme) =>
                  `1px solid ${theme.palette.text.gray_stroke}`,
              }}
              onClick={handleClickNewSiteTextButton}
            >
              <AddCircle sx={{ fontSize: '22px' }} />
            </Button>
          ) : null}
        </Stack>
        <SearchInput
          value={filter}
          onChange={handleFilterChange}
          onClickSearchButton={() => {}}
          placeholder={tr('Search by...')}
        />
      </Stack>

      {quickFilter && (
        <Stack>
          <Typography
            variant="h2"
            sx={{ color: (theme) => theme.palette.text.gray }}
          >
            {quickFilter}
          </Typography>
        </Stack>
      )}

      <Stack gap="16px">
        <Box style={{ textAlign: 'center' }}>
          {loading && <CircularProgress />}
        </Box>
        {cardListComs}

        <IonInfiniteScroll onIonInfinite={handleInfinite}>
          <IonInfiniteScrollContent
            loadingText={`${tr('Loading')}...`}
            loadingSpinner="bubbles"
          />
        </IonInfiniteScroll>
      </Stack>
    </PageLayout>
  );
}
