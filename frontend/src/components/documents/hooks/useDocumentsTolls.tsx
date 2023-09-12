import { StringContentTypes } from '../../../common/utility';

export function useMapTranslationTools() {
  const checkDocumentContent = (
    documentContent: string,
  ): StringContentTypes.BINARY_OR_UNKNOWN | StringContentTypes.TEXT_UTF8 => {
    if (documentContent) {
      return StringContentTypes.TEXT_UTF8;
    } else return StringContentTypes.BINARY_OR_UNKNOWN;
  };

  return {
    checkDocumentContent,
  };
}
