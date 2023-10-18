import { useCallback, useEffect, useState } from 'react';

import tags from 'language-tags';

import { Autocomplete, OptionItem } from '../forms/Autocomplete';
import {
  DESCRIPTIONS_JOINER,
  LOADING_TAG_PLACEHOLDER,
  getLangsRegistry,
  langInfo2tag,
} from '../../../../../utils/dist';

export type LangSelectorProps = {
  title?: string;
  selected: LanguageInfo | null;
  onChange(langTag: string | null, selected: LanguageInfo | null): void;
  setLoadingState?(isLoading: boolean): unknown;
  onClearClick?: () => void;
  enabledTags?: string[];
  disabled?: boolean;
};

type LangsRegistry = {
  langs: Array<TLang>;
  dialects: Array<TDialect>;
  regions: Array<TRegion>;
};

const emptyLangsRegistry: LangsRegistry = {
  langs: [LOADING_TAG_PLACEHOLDER],
  dialects: [LOADING_TAG_PLACEHOLDER],
  regions: [LOADING_TAG_PLACEHOLDER],
};

export function LangSelector({
  title = 'Select language',
  selected,
  onChange,
  setLoadingState,
  onClearClick,
  enabledTags,
  disabled,
}: LangSelectorProps) {
  const [langsRegistry, setLangsRegistry] =
    useState<LangsRegistry>(emptyLangsRegistry);

  useEffect(() => {
    if (setLoadingState) {
      setLoadingState(true);
    }

    getLangsRegistry(enabledTags).then((lr) => {
      setLangsRegistry(lr);
      if (setLoadingState) {
        setLoadingState(false);
      }
    });
  }, [setLoadingState, enabledTags]);

  const handleChange = useCallback(
    (value: OptionItem | null) => {
      if (!value) {
        onChange(null, null);
        return;
      }

      const lang = langsRegistry.langs.find((lr) => lr.tag === value.value);
      if (!lang) return;

      const langTag = lang.tag;

      const langTagFormatted = tags(langTag).format();

      if ((selected && langInfo2tag(selected)) === langTagFormatted) return;

      onChange(langTagFormatted, {
        lang: lang,
        dialect: undefined,
        region: undefined,
      });
    },
    [langsRegistry.langs, onChange, selected],
  );

  return (
    <Autocomplete
      label={title}
      placeholder={title}
      options={langsRegistry.langs.map((l) => ({
        label: l.descriptions
          ? l.descriptions.join(DESCRIPTIONS_JOINER)
          : l.tag,
        value: l.tag,
      }))}
      value={
        selected
          ? {
              label: selected.lang.descriptions
                ? selected.lang.descriptions.join(DESCRIPTIONS_JOINER)
                : selected.lang.tag,
              value: selected.lang.tag,
            }
          : null
      }
      onChange={handleChange}
      onClear={onClearClick}
      disabled={disabled}
    />
  );
}
