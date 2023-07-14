import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPopover,
  IonRadio,
  IonRadioGroup,
  useIonToast,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import {
  FormEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import "./PostCreate2.css";
import { Lexitor } from "./Lexitor";

export type Content_type = 'html' | 'lexical_text' | 'image_url' | 'video_url';

type PartTextCreateProps = {
  readonly default_value: string | null;
  readonly update_content: (content: string) => void;
};

const PartTextCreate2: React.FC<PropsWithChildren<PartTextCreateProps>> = (
  props
) => {
  const lexitor_update = (lex_state: string) => {
    props.update_content(lex_state);
    // console.log('part create', lex_state)
  };

  return (
    <div className="post-create2-wrap">
      <Lexitor
        initial_state={props.default_value}
        on_change={lexitor_update}
        editable={true}
      />
    </div>
  );
};

export default PartTextCreate2;
