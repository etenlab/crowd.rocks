import { updateCacheWithTogglePericopeTrVoteStatus } from '../cacheUpdators/togglePericopeTrVoteStatus';
import { useBestPericopeTrChangedSubscription as useGenBestPericopeTrChangedSubscription } from '../generated/graphql';

export function useBestPericopeTrChangedSubscription() {
  return useGenBestPericopeTrChangedSubscription({
    onData: ({ data, client }) => {
      if (
        !data.data?.bestPericopeTrChanged.newPericopeTr ||
        !data.data.bestPericopeTrChanged.newVoteStatus
      )
        return;
      updateCacheWithTogglePericopeTrVoteStatus(
        client.cache,
        data.data.bestPericopeTrChanged.newVoteStatus,
        data.data.bestPericopeTrChanged.newPericopeTr,
      );
      client.cache;
      console.log(data);
    },
  });
}
