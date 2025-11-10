import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// https://tiptap.dev/docs/examples/basics/default-text-editor

export default () => {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That's it. It's probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
    `,
  })

  return <EditorContent editor={editor} />
}