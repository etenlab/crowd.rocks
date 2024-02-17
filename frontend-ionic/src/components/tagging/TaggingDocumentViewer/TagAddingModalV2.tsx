import { useState, useRef, useEffect } from 'react';
import { Stack, Typography, Divider, IconButton, Button } from '@mui/material';

import { Cancel } from '../../common/icons/Cancel';
import { AddCircle } from '../../common/icons/AddCircle';
import { CheckCircle } from '../../common/icons/CheckCircle';
import { Input } from '../../common/forms/Input';

import { useTr } from '../../../hooks/useTr';

import { useGetDocumentTextFromRangesLazyQuery } from '../../../generated/graphql';
import { useCreateTaggingOnWordRangeMutation } from '../../../hooks/useCreateTaggingOnWordRangeMutation';

type TagAddingModalV2Props = {
  selectedWordRanges: {
    begin: string;
    end: string;
  }[];
  onClose(): void;
};

export function TagAddingModalV2({
  selectedWordRanges,
  onClose,
}: TagAddingModalV2Props) {
  const { tr } = useTr();
  const [tagNameItems, setTagNameItems] = useState<
    { key: string; value: string }[]
  >([
    {
      key: 1 + '',
      value: '',
    },
  ]);
  const [invalidMessage, setInvalidMessage] = useState<{
    invalidItems: string[];
    message: string;
  } | null>(null);
  const tagNameItemKeyRef = useRef<number>(2);

  const [createTaggingOnWordRange] = useCreateTaggingOnWordRangeMutation();
  const [getDocumentTextFromRanges, { data: textFromRangeData }] =
    useGetDocumentTextFromRangesLazyQuery();

  useEffect(() => {
    getDocumentTextFromRanges({
      variables: {
        ranges: selectedWordRanges.map((item) => ({
          begin_document_word_entry_id: item.begin,
          end_document_word_entry_id: item.end,
        })),
      },
    });
  }, [selectedWordRanges, getDocumentTextFromRanges]);

  const handleCancel = () => {
    onClose();
  };

  const checkTagNameItemsValidation = () => {
    const itemMap = new Map<string, string>();

    const duplicated: string[] = [];

    tagNameItems.forEach((item) => {
      const key = itemMap.get(item.value);
      if (key) {
        duplicated.push(...[item.key, key]);
      } else {
        itemMap.set(item.value, item.key);
      }
    });

    if (duplicated.length) {
      setInvalidMessage({
        invalidItems: duplicated,
        message: tr('Exists duplicated tag name items'),
      });

      return false;
    }

    if (tagNameItems.length === 0) {
      setInvalidMessage({
        invalidItems: [],
        message: tr('Please add tag name Items'),
      });

      return false;
    }

    const invalid: string[] = [];

    tagNameItems.forEach((item) => {
      if (item.value.trim() === '') {
        invalid.push(item.key);
      }
    });

    if (invalid.length > 0) {
      setInvalidMessage({
        invalidItems: invalid,
        message: tr('There are empty items'),
      });

      return false;
    }

    return true;
  };

  const handleSaveTagNames = () => {
    if (!checkTagNameItemsValidation()) {
      return;
    }

    createTaggingOnWordRange({
      variables: {
        word_ranges: selectedWordRanges.map((item) => ({
          begin_document_word_entry_id: item.begin,
          end_document_word_entry_id: item.end,
        })),
        tag_names: tagNameItems.map((item) => item.value),
      },
    });

    onClose();
  };

  const handleClearTagNameItem = (key: string) => {
    setTagNameItems((_items) => _items.filter((item) => item.key !== key));
  };

  const handleChangeTagNameItem = (key: string, value: string) => {
    setTagNameItems((_items) => {
      return [
        ..._items.map((item) => {
          if (item.key !== key) {
            return item;
          }
          return {
            key,
            value,
          };
        }),
      ];
    });
  };

  const handleAddTagNameItem = () => {
    setTagNameItems((_items) => {
      return [
        ..._items,
        {
          key: tagNameItemKeyRef.current + '',
          value: '',
        },
      ];
    });

    tagNameItemKeyRef.current++;
  };

  const pieceOfText = textFromRangeData?.getDocumentTextFromRanges.list
    .map((item) => `"${item.piece_of_text}"`)
    .join(', ');

  return (
    <Stack gap="18px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">{tr('Add Tag')}</Typography>
        <IconButton onClick={handleCancel}>
          <Cancel sx={{ fontSize: 24 }} color="dark" />
        </IconButton>
      </Stack>
      <Divider />
      <Typography variant="h5">{`"${pieceOfText}"`}</Typography>
      <Typography variant="overline" color="text.gray">
        {tr('Tag Name')}
      </Typography>

      {tagNameItems.length > 0 ? (
        <Stack gap="16px">
          {tagNameItems.map((item) => (
            <Input
              key={item.key}
              placeholder={`${tr('Tag Name')} ${item.key}`}
              value={item.value}
              onChange={(value) => handleChangeTagNameItem(item.key, value)}
              onClear={() => handleClearTagNameItem(item.key)}
              error={
                (
                  invalidMessage?.invalidItems.filter(
                    (key) => key === item.key,
                  ) || []
                ).length > 0
              }
            />
          ))}

          {invalidMessage ? (
            <Typography variant="overline" color="text.red">
              {invalidMessage.message}
            </Typography>
          ) : null}
        </Stack>
      ) : null}

      <Button
        variant="text"
        startIcon={<AddCircle sx={{ fontSize: 20, marginLeft: '4px' }} />}
        color="orange"
        onClick={handleAddTagNameItem}
        sx={{ justifyContent: 'flex-start', padding: 0 }}
      >
        {tr('Add More')}
      </Button>

      <Stack direction="row" gap="24px">
        <Button
          variant="contained"
          color="gray_stroke"
          fullWidth
          onClick={onClose}
        >
          {tr('Cancel')}
        </Button>
        {tagNameItems.length ? (
          <Button
            variant="contained"
            color="green"
            fullWidth
            onClick={handleSaveTagNames}
            startIcon={<CheckCircle sx={{ fontSize: 20 }} />}
            disabled={!!invalidMessage}
          >
            {tr('Save')}
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
