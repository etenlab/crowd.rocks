import { useSubscribeToPericopiesTrSubscription as useGeneratedSubscribeToPericopiesTrSubscription } from '../generated/graphql';

export function useSubscribeToPericopiesTrSubscription() {
  return useGeneratedSubscribeToPericopiesTrSubscription({
    onData(data) {
      console.log(data);
      // const { data, error } = result;
      // if (
      //   !error &&
      //   data &&
      //   data.pericopiesAdded.pericopies.length > 0 &&
      //   data.pericopiesAdded.error === ErrorType.NoError
      // ) {
      //   const newPericope = data.pericopiesAdded.pericopies[0]!;

      //   updateCacheWithUpsertPericope(client.cache, newPericope);
    },
  });
}
