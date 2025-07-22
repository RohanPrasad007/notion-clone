import React from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

function Editor({ onChange, initialContent, editable }: EditorProps) {
  const editor: BlockNoteEditor | null = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        onChange={(editor: BlockNoteEditor) => {
          onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
        }}
        editable={editable}
      />
      {editor && (
        <div className="editor-container">
          {/* The actual editor view is rendered by useBlockNote */}
          {/* No need for explicit BlockNoteView in newer versions */}
        </div>
      )}
    </div>
  );
}

export default Editor;
