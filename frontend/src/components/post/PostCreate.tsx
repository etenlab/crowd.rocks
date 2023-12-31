// import {
//   IonButton,
//   IonCard,
//   IonCardContent,
//   IonItem,
//   IonLabel,
//   IonList,
//   IonListHeader,
//   IonRadio,
//   IonRadioGroup,
//   useIonToast,
// } from '@ionic/react';
import { PropsWithChildren } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './PostCreate.css';

export type PartCreateDTO = {
  content_type: number;
  rank: number;
  value: string;
};

type PostCreateProps = {
  readonly parent_election: number;
  readonly create_success: (post_id: number) => void;
  readonly default_value: string | null;
  readonly part_id: string | null;
  readonly license_id: number | null;
};

const PostCreate: React.FC<PropsWithChildren<PostCreateProps>> = () => {
  // const [content, set_content] = useState('');

  // const [quill_delta, set_quill_delta] = useState('');

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [postCreateMutation, { data, loading, error }] =
  //   usePostCreateMutation();
  // const [
  //   versionCreateMutation,
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   { data: data2, loading: loading2, error: error2 },
  // ] = useVersionCreateMutation();

  // const [show_license_options, set_show_license_options] = useState(false);

  // const [license_id, set_license_id] = useState(
  //   // eslint-disable-next-line react/prop-types
  //   props.license_id ? props.license_id : 1,
  // );

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [is_unknown_error, set_is_unknown_error] = useState(false);

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [parts_arr, set_part_arr] = useState<Array<PartCreateDTO>>([
  //   {
  //     content_type: 2,
  //     rank: 1,
  //     value: '',
  //   },
  // ]);

  // const [present] = useIonToast();

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const presentToast = (position: 'top' | 'middle' | 'bottom') => {
  //   present({
  //     message: 'Create Success!!',
  //     duration: 2000,
  //     position: position,
  //   });
  // };

  // const modules = {
  //   toolbar: [
  //     [{ header: [1, 2, false] }],
  //     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  //     [
  //       { list: 'ordered' },
  //       { list: 'bullet' },
  //       { indent: '-1' },
  //       { indent: '+1' },
  //     ],
  //     ['link', 'image'],
  //     ['clean'],
  //   ],
  // };

  // // // const modules = {
  // // //   toolbar: `#toolbar`,
  // // // }

  // const formats = [
  //   'header',
  //   'bold',
  //   'italic',
  //   'underline',
  //   'strike',
  //   'blockquote',
  //   'list',
  //   'bullet',
  //   'indent',
  //   'link',
  // ];

  // async function handle_submit(event: FormEvent) {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   if (globals.get_token() === null) return;

  //   let result;
  //   let error;
  //   let post_id: number | null = null;

  //   try {
  //     // eslint-disable-next-line react/prop-types
  //     if (props.default_value && props.part_id) {
  //       result = await versionCreateMutation({
  //         variables: {
  //           postId: props.part_id,
  //           content: quill_delta,
  //           license_id,
  //         },
  //       });
  //       error = result?.data?.versionCreateResolver.error;
  //     } else {
  //       result = await postCreateMutation({
  //         variables: {
  //           parentElection: props.parent_election,
  //           parts: JSON.stringify(parts_arr),
  //           license_id: license_id,
  //         },
  //       });
  //       error = result?.data?.postCreateResolver.error;
  //       post_id = result?.data?.postCreateResolver.post?.post_id
  //         ? +result.data.postCreateResolver.post.post_id
  //         : null;
  //     }
  //   } catch (e) {
  //     console.error('error', e);
  //   }

  //   if (error === ErrorType.NoError) {
  //     // eslint-disable-next-line react/prop-types
  //     if (post_id) props.create_success(post_id);
  //     // presentToast('bottom')
  //     return;
  //   } else if (error === ErrorType.UnknownError) {
  //     set_is_unknown_error(true);
  //   } else {
  //     set_is_unknown_error(true);
  //     console.error(error);
  //   }
  // }

  // const quill_update = (
  //   content: string,
  //   editor: ReactQuill.UnprivilegedEditor,
  // ) => {
  //   const delta = JSON.stringify(editor.getContents());
  //   set_content(content);
  //   if (delta) {
  //     set_quill_delta(delta.toString());
  //   }
  // };

  // useEffect(() => {
  //   // eslint-disable-next-line react/prop-types
  //   if (props.default_value) {
  //     // eslint-disable-next-line react/prop-types
  //     set_content(JSON.parse(props.default_value));
  //   }
  // }, []);

  // return (
  //   <div className="post-create-wrap">
  //     <ReactQuill
  //       theme="snow"
  //       modules={modules}
  //       formats={formats}
  //       value={content}
  //       // eslint-disable-next-line react/prop-types
  //       defaultValue={props.default_value && JSON.parse(props.default_value)}
  //       onChange={(content, delta, source, editor) =>
  //         quill_update(content, editor)
  //       }
  //     />

  //     <div className="post-create-license-wrap ion-text-end">
  //       <div className="post-create-license-button clickable">
  //         <IonButton
  //           fill="clear"
  //           onClick={() => set_show_license_options(!show_license_options)}
  //         >
  //           {licenses.find((entry) => entry.id == license_id)?.title}
  //         </IonButton>
  //       </div>

  //       {show_license_options && (
  //         <IonCard>
  //           <IonCardContent>
  //             <IonList>
  //               <IonListHeader>
  //                 <IonLabel>Choose the copyright for your post</IonLabel>
  //               </IonListHeader>
  //               <IonRadioGroup
  //                 value={license_id}
  //                 onIonChange={(e) => set_license_id(+e.detail.value)}
  //               >
  //                 {licenses.map((entry) => {
  //                   return (
  //                     <IonItem key={entry.id}>
  //                       <IonLabel>{entry.title}</IonLabel>
  //                       <IonRadio
  //                         slot="end"
  //                         value={entry.id}
  //                         onClick={() => set_show_license_options(false)}
  //                       ></IonRadio>
  //                     </IonItem>
  //                   );
  //                 })}
  //               </IonRadioGroup>

  //               <IonItem>
  //                 <a
  //                   href="https://creativecommons.org/about/cclicenses/"
  //                   target="_blank"
  //                   rel="noreferrer"
  //                 >
  //                   Creative Commons License Help
  //                 </a>
  //               </IonItem>
  //             </IonList>
  //           </IonCardContent>
  //         </IonCard>
  //       )}
  //     </div>

  //     <div dangerouslySetInnerHTML={{ __html: content }}></div>
  //     <IonButton
  //       type="submit"
  //       color="primary"
  //       fill="clear"
  //       onClick={handle_submit}
  //     >
  //       Submit
  //     </IonButton>
  //   </div>
  // );
  return <div>PostCreate</div>;
};

export default PostCreate;
