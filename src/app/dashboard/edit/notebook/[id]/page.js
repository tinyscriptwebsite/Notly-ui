"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import { use, useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Save } from "lucide-react";
import { getNotebook, saveNotebook } from "@/utils/api";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

const Page = () => {
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const editor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: 1000 })],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined" && editor) {
      fetchNotebooks(editor);
    }
  }, [editor]);

  const fetchNotebooks = async () => {
    try {
      const { data } = await getNotebook(id);
      console.log(data.data.content);
      if (data && data.data.content) {
        editor.commands.setContent(data.data.content);
      }
    } catch (error) {
      console.error("Failed to load sketch:", error);
    }
  };

  const saveNotes = async () => {
    try {
      if (!editor) return;
      const { data } = await saveNotebook({
        type: "notebook",
        content: content,
      });
      if (data.success) {
        toast.success("Note saved!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const clearNotes = () => {
    if (confirm("Are you sure you want to clear all notes?")) {
      editor?.commands.clearContent();
      localStorage.removeItem("notes");
      setContent("");
    }
  };

  // Get word count
  const getWordCount = () => {
    if (!editor) return 0;
    return editor.getText().trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground px-4">
      <Card className="w-full max-w-2xl shadow-xl p-6 rounded-2xl border border-border">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary flex items-center">
            📝 Notes Editor
          </h2>
          {loading && (
            <Loader2 className="animate-spin text-muted-foreground" />
          )}
        </CardHeader>

        <CardContent>
          <div className="border flex flex-col border-border rounded-lg p-4 min-h-[250px] bg-card text-card-foreground shadow-sm">
            {loading ? (
              <p className="text-muted-foreground">Loading editor...</p>
            ) : (
              <EditorContent editor={editor} className="h-full flex-grow" />
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-muted-foreground text-sm">
              📝 Word count: {getWordCount()}
            </p>
            <div className="flex gap-2">
              <Button
                className="bg-destructive text-white flex items-center gap-2 hover:bg-red-600"
                onClick={clearNotes}
              >
                <Trash2 size={16} /> Clear
              </Button>
              <Button
                className="bg-primary text-primary-foreground flex items-center gap-2 hover:bg-muted"
                onClick={saveNotes}
              >
                <Save size={16} /> Save Notes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
