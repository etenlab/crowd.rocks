import { useState, MouseEvent } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonSearchbar,
  IonToolbar,
  IonIcon,
} from '@ionic/react';
import { useTr } from '../../../hooks/useTr';
import { checkmark } from 'ionicons/icons';

interface TypeaheadProps<T> {
  items: T[];
  selectedItem?: string | undefined;
  title?: string;
  onSelectionCancel?: () => void;
  onSelectionChange?: (item: string | undefined) => void;
}

function AppTypeahead<Item extends { text: string; value: string }>({
  ...props
}: TypeaheadProps<Item>) {
  const { tr } = useTr();
  const [filteredItems, setFilteredItems] = useState<Item[]>([...props.items]);

  const isValueOrTextChecked = (value: string, text: string) => {
    return props.selectedItem === value || props.selectedItem === text;
  };

  const cancelChanges = () => {
    const { onSelectionCancel } = props;
    if (onSelectionCancel !== undefined) {
      onSelectionCancel();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchbarInput = (ev: any) => {
    filterList(ev.target.value);
  };

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  const filterList = (searchQuery: string | null | undefined) => {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined || searchQuery === null) {
      setFilteredItems([...props.items]);
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       * Prefer shorter text lengths first.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      setFilteredItems(
        props.items
          .filter((item) => {
            return item.text.toLowerCase().includes(normalizedQuery);
          })
          .sort((a, b) => {
            if (a.text && a.text.length > 0) {
              return a.text.length - b.text.length;
            }
            if (a.text && a.text.length > 0 && a.text > b.text) {
              return 1;
            }
            if (a.text && a.text.length > 0 && a.text < b.text) {
              return -1;
            }
            return 0;
          }),
      );
    }
  };

  const itemClickHandler = (
    id: string,
    e: MouseEvent<HTMLIonItemElement>,
  ): void => {
    e.preventDefault();
    const { onSelectionChange } = props;
    if (onSelectionChange !== undefined) {
      onSelectionChange(id);
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={cancelChanges}>{tr('Cancel')}</IonButton>
          </IonButtons>
          <IonTitle>{props.title}</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar onIonInput={searchbarInput} />
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" class="ion-padding">
        <IonList id="modal-list" inset={true}>
          {filteredItems.slice(0, 20).map((item) => (
            <IonItem
              button
              onClick={(e) => itemClickHandler(item.value, e)}
              key={item.value}
            >
              {isValueOrTextChecked(item.value, item.text) && (
                <IonIcon slot="end" icon={checkmark} />
              )}
              {item.text}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </>
  );
}
export default AppTypeahead;
