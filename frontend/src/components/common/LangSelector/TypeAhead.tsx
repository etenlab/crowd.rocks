import React, { useState, MouseEvent } from 'react';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonSearchbar,
  IonToolbar,
  IonIcon,
} from '@ionic/react';
import type { CheckboxCustomEvent } from '@ionic/react';
import { useTr } from '../../../hooks/useTr';
import { checkmark } from 'ionicons/icons';

interface TypeaheadProps<T> {
  items: T[];
  selectedItem?: string | undefined;
  title?: string;
  checkboxEnabled?: boolean;
  onSelectionCancel?: () => void;
  onSelectionChange?: (item: string | undefined) => void;
}

function AppTypeahead<Item extends { text: string; value: string }>({
  checkboxEnabled = true,
  ...props
}: TypeaheadProps<Item>) {
  const { tr } = useTr();

  console.log(`selectedItem: ${props.selectedItem}`);
  const [filteredItems, setFilteredItems] = useState<Item[]>([...props.items]);
  const [workingSelectedValue, setWorkingSelectedValue] = useState<
    string | undefined
  >(props.selectedItem);

  const isChecked = (value: string) => {
    return workingSelectedValue === value;
  };

  const cancelChanges = () => {
    const { onSelectionCancel } = props;
    if (onSelectionCancel !== undefined) {
      onSelectionCancel();
    }
  };

  const confirmChanges = () => {
    const { onSelectionChange } = props;
    if (onSelectionChange !== undefined) {
      onSelectionChange(workingSelectedValue);
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
       */
      const normalizedQuery = searchQuery.toLowerCase();
      setFilteredItems(
        props.items.filter((item) => {
          return item.text.toLowerCase().includes(normalizedQuery);
        }),
      );
    }
  };

  const checkboxChange = (ev: CheckboxCustomEvent) => {
    const { value } = ev.detail;
    setWorkingSelectedValue(value);
  };

  const itemClickHandler = (
    id: string,
    e: MouseEvent<HTMLIonItemElement>,
  ): void => {
    e.preventDefault();
    setWorkingSelectedValue(id);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={cancelChanges}>{tr('Cancel')}</IonButton>
          </IonButtons>
          <IonTitle>{props.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={confirmChanges}>{tr('Done')}</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar onIonInput={searchbarInput} />
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" class="ion-padding">
        <IonList id="modal-list" inset={true}>
          {filteredItems.slice(0, 20).map((item) => (
            <IonItem
              button={!checkboxEnabled}
              onClick={
                !checkboxEnabled
                  ? (e) => itemClickHandler(item.value, e)
                  : undefined
              }
              key={item.value}
            >
              {checkboxEnabled ? (
                <IonCheckbox
                  value={item.value}
                  checked={isChecked(item.value)}
                  onIonChange={checkboxChange}
                >
                  {item.text}
                </IonCheckbox>
              ) : (
                item.text
              )}
              {!checkboxEnabled && isChecked(item.value) && (
                <IonIcon slot="end" icon={checkmark} />
              )}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </>
  );
}
export default AppTypeahead;
