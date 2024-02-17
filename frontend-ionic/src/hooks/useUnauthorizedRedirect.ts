import { useIonRouter } from '@ionic/react';
import { ErrorType } from '../generated/graphql';
import { useAppContext } from './useAppContext';

export function useUnauthorizedRedirect() {
  const {
    states: {
      global: {
        langauges: { appLanguage },
      },
      components: { modals },
    },
    actions: { removeModal },
  } = useAppContext();
  const router = useIonRouter();
  return (error?: ErrorType) => {
    if (error === ErrorType.Unauthorized) {
      modals.map((modal) => removeModal(modal.id));
      localStorage.setItem('login-redirect', 'back');
      router.push(`/US/${appLanguage.lang.tag}/1/login`);
    }
  };
}
