import React, { useCallback, useEffect, useRef, useState } from 'react';

import tags from 'language-tags';
import { langInfo2tag, sortTagInfosFn } from '../../../common/langUtils';
import AppTypeahead from './TypeAhead';
import {
  DESCRIPTIONS_JOINER,
  LOADING_TAG_PLACEHOLDER,
  NOT_DEFINED_PLACEHOLDER,
} from '../../../const/langConst';
import { IonItem, IonLabel, IonModal } from '@ionic/react';

export type LangSelectorProps = {
  title?: string;
  langSelectorId: string;
  selected: LanguageInfo | undefined;
  onChange(langTag: string | null, selected: LanguageInfo): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setLoadingState?(isLoading: boolean): any;
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

enum TagTypes {
  LANGUAGE = 'language',
  REGION = 'region',
  DIALECT = 'variant',
}
enum TagSpecialDescriptions {
  PRIVATE_USE = 'Private use',
}

export function LangSelector({
  title = 'Select language',
  langSelectorId,
  selected,
  onChange,
  setLoadingState,
}: LangSelectorProps) {
  const [langsRegistry, setLangsRegistry] =
    useState<LangsRegistry>(emptyLangsRegistry);

  const [selectedLang, setSelectedLang] = useState<TLang | null>(null);
  const [selectedDialect, setSelectedDialect] = useState<TDialect | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<TRegion | null>(null);

  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    if (setLoadingState) {
      setLoadingState(true);
    }
    // make it async to test and prepare for possible language library change to async
    const getLangsRegistry = async (): Promise<LangsRegistry> => {
      return new Promise((resolve) => {
        const allTags = tags.search(/.*/);
        const langs: Array<TLang> = [];
        const dialects: Array<TDialect> = [
          { tag: null, descriptions: [NOT_DEFINED_PLACEHOLDER] },
        ];
        const regions: Array<TRegion> = [
          { tag: null, descriptions: [NOT_DEFINED_PLACEHOLDER] },
        ];
        for (const currTag of allTags) {
          // TODO temporary limitation - need to optimize to allow full list
          //----------
          const enabledTags = ['en', 'uk', 'apq', 'aas'];
          if (!enabledTags.includes(currTag.format())) continue;
          //----------

          if (
            currTag.deprecated() ||
            currTag.descriptions().includes(TagSpecialDescriptions.PRIVATE_USE)
          ) {
            continue;
          }

          if (currTag.type() === TagTypes.LANGUAGE) {
            langs.push({
              tag: currTag.format(),
              descriptions: currTag.descriptions(),
            });
          }
          if (currTag.type() === TagTypes.REGION) {
            regions.push({
              tag: currTag.format(),
              descriptions: currTag.descriptions(),
            });
          }
          if (currTag.type() === TagTypes.DIALECT) {
            dialects.push({
              tag: currTag.format(),
              descriptions: currTag.descriptions(),
            });
          }
        }
        langs.sort(sortTagInfosFn);
        dialects.sort(sortTagInfosFn);
        regions.sort(sortTagInfosFn);
        resolve({
          langs,
          dialects,
          regions,
        });
      });
    };

    getLangsRegistry().then((lr) => {
      setLangsRegistry(lr);
      if (setLoadingState) {
        setLoadingState(false);
      }
    });
  }, [setLoadingState]);

  useEffect(() => {
    setSelectedLang(selected?.lang || null);
    setSelectedDialect(selected?.dialect || null);
    setSelectedRegion(selected?.region || null);
  }, [selected]);

  useEffect(() => {
    if (!selectedLang) return;
    let langTag = selectedLang.tag;
    selectedRegion?.tag && (langTag += '-' + selectedRegion.tag);
    selectedDialect?.tag && (langTag += '-' + selectedDialect.tag);
    const langTagFormatted = tags(langTag).format();

    if (langInfo2tag(selected) === langTagFormatted) return;
    onChange(langTagFormatted, {
      lang: selectedLang,
      dialect: selectedDialect?.tag ? selectedDialect : undefined,
      region: selectedRegion?.tag ? selectedRegion : undefined,
    });
  }, [onChange, selected, selectedDialect, selectedLang, selectedRegion]);

  const handleSetLanguage = useCallback(
    (tag: string | undefined) => {
      if (!tag) return;
      const lang = langsRegistry.langs.find((lr) => lr.tag === tag);
      if (!lang) return;
      setSelectedLang(lang);
      modal.current?.dismiss();
    },
    [langsRegistry.langs],
  );

  const selectedLangValue =
    selectedLang?.descriptions?.join(DESCRIPTIONS_JOINER) || title;

  return (
    <>
      <IonItem button={true} detail={false} id={langSelectorId}>
        <IonLabel>{selectedLangValue}</IonLabel>
      </IonItem>
      <IonModal trigger={langSelectorId} ref={modal}>
        <AppTypeahead
          title={title}
          items={langsRegistry.langs.map((l) => ({
            text: l.descriptions
              ? l.descriptions.join(DESCRIPTIONS_JOINER)
              : l.tag,
            value: l.tag,
          }))}
          selectedItem={selectedLang?.tag ? selectedLang.tag : undefined}
          onSelectionCancel={() => modal.current?.dismiss()}
          onSelectionChange={(tag) => handleSetLanguage(tag)}
        />
      </IonModal>
    </>
  );
}