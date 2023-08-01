import { IonImg } from '@ionic/react';

import { PropsWithChildren } from 'react';
import { useUserReadQuery } from '../../generated/graphql';

import 'react-quill/dist/quill.snow.css';
import './UserRead.css';

type UserReadProps = {
  user_id: string;
};

const UserRead: React.FC<PropsWithChildren<UserReadProps>> = (props) => {
  const { data } = useUserReadQuery({
    variables: {
      // eslint-disable-next-line react/prop-types
      userId: props.user_id,
    },
  });

  return (
    <span className="user-read-wrap">
      {data?.userReadResolver.user?.avatar_url && (
        <span className="user-read-image-span">
          <IonImg
            className="user-read-image"
            src={data.userReadResolver.user.avatar_url}
          ></IonImg>
        </span>
      )}
      <span>{data?.userReadResolver.user?.avatar}</span>
    </span>
  );
};

export default UserRead;
