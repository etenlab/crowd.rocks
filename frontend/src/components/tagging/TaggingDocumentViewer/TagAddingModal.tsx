import { useState, useRef, useEffect } from 'react';
import { Stack, Typography, Divider, IconButton, Button } from '@mui/material';

import { Cancel } from '../../common/icons/Cancel';
import { AddCircle } from '../../common/icons/AddCircle';
import { CheckCircle } from '../../common/icons/CheckCircle';
import { Input } from '../../common/forms/Input';

import { useTr } from '../../../hooks/useTr';

import {
  useCreateTaggingOnWordRangeMutation,
  useGetDocumentTextFromRangesLazyQuery,
} from '../../../generated/graphql';

type TagAddingModalProps = {
  begin_document_word_entry_id: string;
  end_document_word_entry_id: string;
  onClose(): void;
};

export function TagAddingModal({
  begin_document_word_entry_id,
  end_document_word_entry_id,
  onClose,
}: TagAddingModalProps) {
  const { tr } = useTr();
  const [tagNameItems, setTagNameItems] = useState<
    { key: string; value: string }[]
  >([]);
  const [invalidMessage, setInvalidMessage] = useState<{
    invalidItems: string[];
    message: string;
  } | null>(null);
  const tagNameItemKeyRef = useRef<number>(1);

  const [createTaggingOnWordRange] = useCreateTaggingOnWordRangeMutation();
  const [getDocumentTextFromRange, { data: textFromRangeData }] =
    useGetDocumentTextFromRangesLazyQuery();

  useEffect(() => {
    getDocumentTextFromRange({
      variables: {
        ranges: [
          {
            begin_document_word_entry_id: begin_document_word_entry_id,
            end_document_word_entry_id: end_document_word_entry_id,
          },
        ],
      },
    });
  }, [
    begin_document_word_entry_id,
    end_document_word_entry_id,
    getDocumentTextFromRange,
  ]);

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
        begin_document_word_entry_id,
        end_document_word_entry_id,
        tag_names: tagNameItems.map((item) => item.value),
      },
    });
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

  const pieceOfText =
    textFromRangeData?.getDocumentTextFromRanges.list[0].piece_of_text || '';

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
        startIcon={<AddCircle sx={{ fontSize: 20 }} />}
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
