import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import ExampleTheme from "./themes/ExampleTheme";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import {createEditor} from 'lexical';

import "./Lexitor.css";
import { useRef } from "react";

export type LexitorProps = {
  initial_state: string | null;
  on_change: (lex_state: string) => void;
  editable: boolean
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




  function onError(error: any) {
    console.error(error);
  }
  
  let initialState:any = null
  if (props.initial_state){
    const tempEditor = createEditor({namespace: 'lex1'})
    const asdf = tempEditor.parseEditorState(JSON.parse(props.initial_state))
    initialState = asdf
  }
  
  const editorConfig = {
    editorState: initialState,
    namespace: 'lex1',
    onError: onError,
  }


  const onChange = (e: any) => {
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
          props.editable &&
          <ToolbarPlugin />
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
