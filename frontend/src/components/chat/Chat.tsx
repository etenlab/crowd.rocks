import { IonLabel } from '@ionic/react';
import { useGetTotalPostsQuery } from '../../generated/graphql';
import { StChatIcon } from '../common/styled';
import { chatbubbleEllipsesSharp } from 'ionicons/icons';

type ChatProps = {
  parent_table: string;
  parent_id: string;
  onClick: () => void;
};

export function Chat({ parent_id, parent_table, onClick }: ChatProps) {
  const { data: postCountData } = useGetTotalPostsQuery({
    variables: { parent_id: parent_id, parent_name: parent_table },
  });

  return (
    <>
      <StChatIcon
        icon={chatbubbleEllipsesSharp}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      />
      <IonLabel>
        <p>
          {postCountData?.getTotalPosts.total === 0
            ? ''
            : postCountData?.getTotalPosts.total}
        </p>
      </IonLabel>
    </>
  );
}
