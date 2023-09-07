import { ReactNode } from 'react';
import {
  CustomCard,
  CustomCardTitle,
  CustomCardContent,
  CustomCardHeader,
} from './styled';

import { IonIcon } from '@ionic/react';
import { ellipse, ellipseOutline, trashOutline } from 'ionicons/icons';

export type NotificationInfo = {
  id: string;
  text: string;
  isRead: boolean;
};

type NotificationCardProps = {
  info: NotificationInfo;
  description?: ReactNode;
  onClick?: () => void;
  onDeleteClick?: () => void;
  routerLink?: string;
};

export function NotificationCard({
  info,
  description,
  onClick,
  onDeleteClick,
  routerLink,
}: NotificationCardProps) {
  return (
    <CustomCard
      onClick={() => onClick && onClick()}
      routerLink={routerLink}
      style={{ cursor: onClick ? 'pointer' : 'unset' }}
    >
      <CustomCardHeader>
        <CustomCardTitle>
          <div style={{ display: 'flex' }}>
            <IonIcon
              icon={info.isRead ? ellipseOutline : ellipse}
              color={info.isRead ? 'white' : 'primary'}
              style={{ paddingRight: '15px', marginTop: '2px' }}
            />
            {info.text}
          </div>
          {onDeleteClick && (
            <div>
              <IonIcon
                icon={trashOutline}
                size="small"
                className="clickable"
                onClick={() => onDeleteClick()}
              />
            </div>
          )}
        </CustomCardTitle>
      </CustomCardHeader>

      {description ? (
        <CustomCardContent>{description}</CustomCardContent>
      ) : null}
    </CustomCard>
  );
}
