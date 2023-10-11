import { Module, forwardRef } from '@nestjs/common';

import { CoreModule } from 'src/core/core.module';

import { QuestionAndAnswersResolver } from './question-answer.resolver';

import { QuestionItemsService } from './question-items.service';
import { QuestionsService } from './questions.service';
import { AnswersService } from './answers.service';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [forwardRef(() => CoreModule), forwardRef(() => DocumentsModule)],
  providers: [
    QuestionItemsService,
    QuestionsService,
    AnswersService,
    QuestionAndAnswersResolver,
  ],
  exports: [QuestionItemsService, QuestionsService, AnswersService],
})
export class QuestionAndAnswersModule {}
