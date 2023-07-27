import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import { createEditor } from 'lexical';

import './Lexitor.css';

export type LexitorProps = {
  initial_state: string | null;
  on_change: (lex_state: string) => void;
  editable: boolean;
};

export const Lexitor: React.FC<LexitorProps> = (props) => {
  function Placeholder() {
    return <div className="editor-placeholder">Share your thoughts...</div>;
  }

  // const default_initial_state = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;

  // const editorConfig = {
  //   editable: props.editable,
  //   namespace: "lex1",
  //   editorState: props.initial_state ? props.initial_state : default_initial_state,
  //   // The editor theme
  //   theme: ExampleTheme,
  //   // Handling of errors during update
  //   onError(error: any) {
  //     throw error;
  //   },
  //   // Any custom nodes go here
  //   nodes: [
  //     HeadingNode,
  //     ListNode,
  //     ListItemNode,
  //     QuoteNode,
  //     CodeNode,
  //     CodeHighlightNode,
  //     TableNode,
  //     TableCellNode,
  //     TableRowNode,
  //     AutoLinkNode,
  //     LinkNode,
  //   ],
  // };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onError(error: any) {
    console.error(error);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let initialState: any = null;
  // eslint-disable-next-line react/prop-types
  if (props.initial_state) {
    const tempEditor = createEditor({ namespace: 'lex1' });
    // eslint-disable-next-line react/prop-types
    const asdf = tempEditor.parseEditorState(JSON.parse(props.initial_state));
    initialState = asdf;
  }

  const editorConfig = {
    editorState: initialState,
    namespace: 'lex1',
    onError: onError,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (e: any) => {
    // eslint-disable-next-line react/prop-types
    props.on_change(JSON.stringify(e));
    // editorStateRef.current = e
    // console.log(JSON.stringify(e))
  };

  return (
    // <LexicalComposer initialConfig={{
    //   editorState: initialEditorState,
    //   namespace: 'asdf',
    //   onError: onError,
    // }}>
    //   <LexicalRichTextPlugin />
    //   <OnChangePlugin onChange={editorState => editorStateRef.current = editorState} />
    //   <Button label="Save" onPress={() => {
    //     if (editorStateRef.current) {
    //       saveContent(JSON.stringify(editorStateRef.current))
    //     }
    //   }} />
    // </LexicalComposer>
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        {
          // eslint-disable-next-line react/prop-types
          // props.editable && <ToolbarPlugin />
        }
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          {/* <HistoryPlugin /> */}
          {/* <TreeViewPlugin /> */}
          {/* <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} /> */}
          <OnChangePlugin onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
};
