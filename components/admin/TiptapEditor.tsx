'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content = '',
  onChange,
  placeholder = 'Write research narrative, equations, methodology, or code tutorials...',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[var(--color-accent)] underline underline-offset-2',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-[var(--color-border)] max-w-full my-4',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'min-h-[280px] max-h-[600px] overflow-y-auto px-4 py-3 text-sm focus:outline-none text-[var(--color-foreground)] leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="h-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-xs text-[var(--color-muted)] flex items-center justify-center">
        Loading rich text editor...
      </div>
    );
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter hyperlink URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:border-transparent transition-all">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-foreground)]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('bold') ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Bold"
        >
          <Bold size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('italic') ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Italic"
        >
          <Italic size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('strike') ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('code') ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Inline Code"
        >
          <Code size={15} />
        </button>

        <div className="h-4 w-px bg-[var(--color-border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('heading', { level: 1 }) ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('heading', { level: 3 }) ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </button>

        <div className="h-4 w-px bg-[var(--color-border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('bulletList') ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Bullet List"
        >
          <List size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('orderedList') ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('blockquote') ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Blockquote"
        >
          <Quote size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded hover:bg-[var(--color-surface-raised)]"
          title="Horizontal Rule"
        >
          <Minus size={15} />
        </button>

        <div className="h-4 w-px bg-[var(--color-border)] mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-[var(--color-surface-raised)] ${
            editor.isActive('link') ? 'bg-[var(--color-surface-raised)] text-[var(--color-accent)]' : ''
          }`}
          title="Add Link"
        >
          <LinkIcon size={15} />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-[var(--color-surface-raised)]"
          title="Add Image"
        >
          <ImageIcon size={15} />
        </button>

        <div className="h-4 w-px bg-[var(--color-border)] mx-1 ml-auto" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-[var(--color-surface-raised)] disabled:opacity-30"
          title="Undo"
        >
          <Undo size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-[var(--color-surface-raised)] disabled:opacity-30"
          title="Redo"
        >
          <Redo size={15} />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
