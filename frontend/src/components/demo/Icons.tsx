import { PageLayout } from '../common/PageLayout';
import { Caption } from '../common/Caption/Caption';

import { AddCircle } from '../common/icons/AddCircle';
import { AppNotification } from '../common/icons/AppNotification';
import { Cancel } from '../common/icons/Cancel';
import { ChatBubbleEmpty } from '../common/icons/ChatBubbleEmpty';
import { ChatLines } from '../common/icons/ChatLines';
import { Check } from '../common/icons/Check';
import { CheckCircle } from '../common/icons/CheckCircle';
import { DeleteCircle } from '../common/icons/DeleteCircle';
import { DownloadCircle } from '../common/icons/DownloadCircle';
import { MoreHoriz } from '../common/icons/MoreHoriz';
import { MoreVert } from '../common/icons/MoreVert';
import { NavArrowLeft } from '../common/icons/NavArrowLeft';
import { NavArrowRight } from '../common/icons/NavArrowRight';
import { NavArrowUp } from '../common/icons/NavArrowUp';
import { NavArrowDown } from '../common/icons/NavArrowDown';
import { Search } from '../common/icons/Search';
import { ThumbsUp } from '../common/icons/ThumbsUp';
import { ThumbsDown } from '../common/icons/ThumbsDown';
import { FilledCheckCircle } from '../common/icons/FilledCheckCircle';
import { WarningCircle } from '../common/icons/WarningCircle';
import { FilterList } from '../common/icons/FilterList';
import { InfoEmpty } from '../common/icons/InfoEmpty';
import { InfoFill } from '../common/icons/InfoFill';

const icons = [
  AddCircle,
  AppNotification,
  Cancel,
  ChatBubbleEmpty,
  ChatLines,
  Check,
  CheckCircle,
  DeleteCircle,
  DownloadCircle,
  MoreHoriz,
  MoreVert,
  NavArrowDown,
  NavArrowUp,
  NavArrowLeft,
  NavArrowRight,
  Search,
  ThumbsUp,
  ThumbsDown,
  FilledCheckCircle,
  WarningCircle,
  FilterList,
  InfoEmpty,
  InfoFill,
];

export function Icons() {
  return (
    <PageLayout>
      <Caption>UI Icons</Caption>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {icons.map((Icon) => (
          <div key={Icon.name}>
            <Icon color="red" />
            <div>{Icon.name}</div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
