import { Injectable } from '@nestjs/common';
import { LanguageInput } from '../common/types';
import { PericopeTrService } from '../pericope-translations/pericope-tr.service';
import {
  PericopiesService,
  WORDS_JOINER,
} from '../pericopies/pericopies.service';
import { FileService } from '../file/file.service';
import { FileUrlOutput } from './types';
import { Readable } from 'stream';
import { DocumentsService } from './documents.service';
import { putLangCodesToFileName } from '../../common/utility';
import { ErrorType } from '../../common/types';

const DEFAULT_TEXTY_FILE_MIME_TYPE = 'text/plain';

@Injectable()
export class DocumentTranslateService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly pericopeTrService: PericopeTrService,
    private readonly pericopiesService: PericopiesService,
    private readonly fileService: FileService,
  ) {}

  async translateByPericopies(
    documentId: string,
    targetLang: LanguageInput,
  ): Promise<FileUrlOutput> {
    const document = await this.documentsService.getDocument(
      Number(documentId),
    );
    if (document.error || !document.document?.file_name) {
      return {
        error: ErrorType.DocumentNotFound,
        fileUrl: null,
      };
    }
    const start_word = await this.pericopiesService.getFirstWordOfDocument(
      documentId,
    );
    const allWords =
      start_word === null
        ? []
        : await this.pericopiesService.getWordsTillEndOfDocument(
            documentId,
            start_word,
          );
    const pericopeIds: string[] = [];
    allWords.forEach((word) => {
      if (word.pericope_id) {
        pericopeIds.push(word.pericope_id);
      }
    });
    const pericopeTranslationsPromises = pericopeIds.map((pId) =>
      this.pericopeTrService.getRecomendedPericopeTranslation(pId, targetLang),
    );
    const pericopiesTranslations = await Promise.all(
      pericopeTranslationsPromises,
    );
    const fileContentStream = Readable.from([
      pericopiesTranslations.join(WORDS_JOINER),
    ]);
    const newFileName = putLangCodesToFileName(
      document.document.file_name,
      targetLang,
      'by_pericopies',
    );

    const fileUrl = await this.fileService.uploadTemporaryFile(
      fileContentStream,
      newFileName,
      DEFAULT_TEXTY_FILE_MIME_TYPE,
    );
    return { error: ErrorType.NoError, fileUrl };
  }
}
