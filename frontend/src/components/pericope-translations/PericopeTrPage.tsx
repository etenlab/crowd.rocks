import { RouteComponentProps, useHistory } from 'react-router';
import { useAppContext } from '../../hooks/useAppContext';
import { PageLayout } from '../common/PageLayout';
import { Caption } from '../common/Caption/Caption';
import { useTr } from '../../hooks/useTr';
import { useIonRouter } from '@ionic/react';
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
  const router = useIonRouter();
  const history = useHistory();
  const {
    states: {
      global: {
        langauges: { sourceLang, targetLang },
      },
    },
    actions: { setSourceLanguage, setTargetLanguage },
  } = useAppContext();

  const handleGoToTranslation = () => {
    // todo
    history.push(`/${nation_id}/${language_id}/1/maps/translation/all`);
  };

  return (
    <PageLayout>
      <Caption
        onBackClick={() => {
          router.push(`/${nation_id}/${language_id}/1/home`);
        }}
      >
        {tr('Translation')}
      </Caption>
      <LangSelector
        title={tr('Select your language')}
        selected={sourceLang}
        onChange={(_langTag, langInfo) => {
          setSourceLanguage(langInfo);
        }}
        onClearClick={() => setSourceLanguage(null)}
      />
      <LangSelector
        title={tr('Select target language')}
        selected={targetLang}
        onChange={(_langTag, langInfo) => {
          setTargetLanguage(langInfo);
        }}
        onClearClick={() => setTargetLanguage(null)}
      />
      <Button
        variant="contained"
        color="blue"
        onClick={handleGoToTranslation}
        sx={{ marginTop: '30px' }}
      >
        {tr('Show Documents')}
      </Button>
    </PageLayout>
  );
};
