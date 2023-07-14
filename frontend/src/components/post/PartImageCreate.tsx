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
import { globals } from "../../services/globals";
import {
  ErrorType,
  namedOperations,
  usePostCreateMutation,
  useVersionCreateMutation,
} from "../../generated/graphql";
import "react-quill/dist/quill.snow.css";
import "./PartImageCreate.css";
import { licenses } from "./licenses";

type PartImageCreateProps = {
  readonly parent_election: number;
  readonly create_success: (post_id: number) => void;
  readonly default_value: string | null;
  readonly part_id: string | null;
  readonly license_id: number | null;
};

const PartImageCreate: React.FC<PropsWithChildren<PartImageCreateProps>> = (
  props
) => {
  return <div className="part-image-create-wrap"></div>;
};

export default PartImageCreate;
