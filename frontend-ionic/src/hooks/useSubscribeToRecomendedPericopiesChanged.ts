import {
  GetPericopiesTrDocument,
  useSubscribeToRecomendedPericopiesChangedSubscription as useGenSubscribeToRecomendedPericopiesChangedSubscription,
} from '../generated/graphql';

export function useSubscribeToRecomendedPericopiesChangedSubscription() {
  return useGenSubscribeToRecomendedPericopiesChangedSubscription({
    onData: ({ client }) => {
      client.refetchQueries({
        include: [GetPericopiesTrDocument],
      });
    },
  });
}
