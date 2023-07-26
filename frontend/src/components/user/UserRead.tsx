import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonIcon,
  IonImg,
} from '@ionic/react';
import { Maybe } from 'graphql/jsutils/Maybe';
import { chevronBack, chevronDown, create } from 'ionicons/icons';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Post, useUserReadQuery } from '../../generated/graphql';
import PostCreate from '../post/PostCreate';
import VoteBox from '../voting/VoteBox';
import 'react-quill/dist/quill.snow.css';
import './UserRead.css';
import {
  get_cardinal_suffix,
  get_datetime_string,
  useForceUpdate,
} from '../../common/utility';

type UserReadProps = {
  user_id: string;
};

const UserRead: React.FC<PropsWithChildren<UserReadProps>> = (props) => {
  const { data, loading, error } = useUserReadQuery({
    variables: {
      userId: props.user_id,
    },
  });

  return (
    <span className="user-read-wrap">
      {data?.userReadResolver.user?.profile_url && (
        <span className="user-read-image-span">
          <IonImg
            className="user-read-image"
            src={data.userReadResolver.user.profile_url}
          ></IonImg>
        </span>
      )}
      <span>{data?.userReadResolver.user?.avatar}</span>
    </span>
  );
};

export default UserRead;
