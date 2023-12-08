import { RouteComponentProps, useHistory } from 'react-router';
import { useAppContext } from '../../hooks/useAppContext';
import { PageLayout } from '../common/PageLayout';
import { Caption } from '../common/Caption/Caption';
import { useTr } from '../../hooks/useTr';
import { LangSelector } from '../common/LangSelector/LangSelector';
import { Button } from '@mui/material';

interface PericopeTrPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export const PericopeTrPage: React.FC<PericopeTrPageProps> = ({
  match,
}: PericopeTrPageProps) => {
  const { nation_id, language_id } = match.params;
  const { tr } = useTr();
  const history = useHistory();
  const {
    states: {
      global: {
        langauges: {
          documentPage: { source: sourceLang, target: targetLang },
        },
      },
    },
    actions: { changeDocumentSourceLanguage, changeDocumentTargetLanguage },
  } = useAppContext();

  const handleShowDocuments = () => {
    history.push(
      `/${nation_id}/${language_id}/1/pericope-translations/documents`,
    );
  };

  return (
    <PageLayout>
      <Caption
        onBackClick={() => {
          history.push(`/${nation_id}/${language_id}/1/home`);
        }}
      >
        {tr('Translation')}
      </Caption>
      <LangSelector
        title={tr('Select your language')}
        selected={sourceLang}
        onChange={(_langTag, langInfo) => {
          changeDocumentSourceLanguage(langInfo);
        }}
        onClearClick={() => changeDocumentSourceLanguage(null)}
      />
      <LangSelector
        title={tr('Select target language')}
        selected={targetLang}
        onChange={(_langTag, langInfo) => {
          changeDocumentTargetLanguage(langInfo);
        }}
        onClearClick={() => changeDocumentTargetLanguage(null)}
      />
      <Button
        variant="contained"
        color="blue"
        onClick={handleShowDocuments}
        sx={{ marginTop: '30px' }}
      >
        {tr('Show Documents')}
      </Button>
    </PageLayout>
  );
};
