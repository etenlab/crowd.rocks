import { updateCacheWithTogglePericopeTrVoteStatus } from '../cacheUpdators/togglePericopeTrVoteStatus';
import { useVotePericopeTrChangedSubscription as useGenVotePericopeTrChangedSubscription } from '../generated/graphql';

export function useVotePericopeTrChangedSubscription() {
  return useGenVotePericopeTrChangedSubscription({
    onData: ({ data, client }) => {
      if (
        !data.data?.votePericopeTrChanged.newPericopeTr ||
        !data.data.votePericopeTrChanged.newVoteStatus
      )
        return;
      updateCacheWithTogglePericopeTrVoteStatus(
        client.cache,
        data.data.votePericopeTrChanged.newVoteStatus,
        data.data.votePericopeTrChanged.newPericopeTr,
      );
    },
  });
}
