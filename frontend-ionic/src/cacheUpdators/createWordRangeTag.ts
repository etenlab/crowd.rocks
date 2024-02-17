import { ApolloCache } from '@apollo/client';

import {
  GetWordRangeTagsByDocumentIdQuery,
  GetWordRangeTagsByDocumentIdDocument,
  GetWordRangeTagsByBeginWordEntryIdDocument,
  GetWordRangeTagsByBeginWordEntryIdQuery,
  WordRangeTagsEdge,
  WordRangeTagsEdgeFragmentFragmentDoc,
  WordRangeTagWithVote,
} from '../generated/graphql';

export function updateCacheWithCreateWordRangeTags(
  cache: ApolloCache<unknown>,
  newWordRangeTags: (WordRangeTagWithVote | null)[],
) {
  for (const tag of newWordRangeTags) {
    if (!tag) {
      continue;
    }

    const documentId = +tag.word_range.begin.document_id;
    const page = +tag.word_range.begin.page;

    const tagsData = cache.readQuery<GetWordRangeTagsByDocumentIdQuery>({
      query: GetWordRangeTagsByDocumentIdDocument,
      variables: {
        document_id: documentId + '',
      },
    });

    if (!tagsData) {
      continue;
    }

    const exists = tagsData.getWordRangeTagsByDocumentId.edges.filter(
      (edge) =>
        edge.cursor === JSON.stringify({ document_id: documentId, page }),
    );

    if (exists.length > 0) {
      cache.updateFragment<WordRangeTagsEdge>(
        {
          id: cache.identify({
            __typename: 'WordRangeTagsEdge',
            cursor: JSON.stringify({ document_id: documentId, page }),
          }),
          fragment: WordRangeTagsEdgeFragmentFragmentDoc,
          fragmentName: 'WordRangeTagsEdgeFragment',
        },
        (data) => {
          if (data) {
            return {
              ...data,
              node: [
                ...data.node,
                {
                  ...tag,
                },
              ],
            };
          } else {
            return {
              __typename: 'WordRangeTagsEdge',
              cursor: JSON.stringify({ document_id: documentId, page }),
              node: [
                {
                  ...tag,
                },
              ],
            };
          }
        },
      );
    } else {
      cache.writeQuery<GetWordRangeTagsByDocumentIdQuery>({
        query: GetWordRangeTagsByDocumentIdDocument,
        variables: {
          document_id: documentId + '',
        },
        data: {
          getWordRangeTagsByDocumentId: {
            ...tagsData.getWordRangeTagsByDocumentId,
            edges: [
              ...tagsData.getWordRangeTagsByDocumentId.edges,
              {
                __typename: 'WordRangeTagsEdge',
                cursor: JSON.stringify({ document_id: documentId, page }),
                node: [
                  {
                    ...tag,
                  },
                ],
              },
            ],
          },
        },
      });
    }
  }

  for (const tag of newWordRangeTags) {
    if (!tag) {
      continue;
    }

    const tagsData = cache.readQuery<GetWordRangeTagsByBeginWordEntryIdQuery>({
      query: GetWordRangeTagsByBeginWordEntryIdDocument,
      variables: {
        begin_document_word_entry_id:
          tag.word_range.begin.document_word_entry_id,
      },
    });

    if (!tagsData) {
      continue;
    }

    const exists =
      tagsData.getWordRangeTagsByBeginWordEntryId.word_range_tags.filter(
        (item) => {
          if (item) {
            return item.word_range_tag_id === tag.word_range_tag_id;
          } else {
            return false;
          }
        },
      );

    if (exists.length > 0) {
      continue;
    }

    cache.writeQuery<GetWordRangeTagsByBeginWordEntryIdQuery>({
      query: GetWordRangeTagsByBeginWordEntryIdDocument,
      variables: {
        begin_document_word_entry_id:
          tag.word_range.begin.document_word_entry_id,
      },
      data: {
        getWordRangeTagsByBeginWordEntryId: {
          ...tagsData.getWordRangeTagsByBeginWordEntryId,
          word_range_tags: [
            ...tagsData.getWordRangeTagsByBeginWordEntryId.word_range_tags,
            tag,
          ],
        },
      },
    });
  }
}
