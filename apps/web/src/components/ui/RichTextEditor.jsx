import { useRef, useMemo, useCallback } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { api } from "../../lib/api";

// ── Custom Table Embed Blot ──────────────────────────────────────
const TableEmbed = Quill.import("blots/embed");

class TableEmbedBlot extends TableEmbed {
  static create(value) {
    const node = super.create();
    node.innerHTML = value;
    return node;
  }

  static value(node) {
    return node.innerHTML;
  }
}

TableEmbedBlot.blotName = "table-embed";
TableEmbedBlot.tagName = "div";
TableEmbedBlot.className = "ql-table-embed";

Quill.register(TableEmbedBlot);

// ── Get Delta class for clipboard matchers ───────────────────────
const Delta = Quill.import("delta");

// ── Helper to generate an HTML table string ──────────────────────
const buildTableHtml = (rows, cols) => {
  let html = '<table><tbody>';
  for (let r = 0; r < rows; r++) {
    html += '<tr>';
    for (let c = 0; c < cols; c++) {
      if (r === 0) {
        html += `<th>Header ${c + 1}</th>`;
      } else {
        html += `<td>Cell ${r + 1},${c + 1}</td>`;
      }
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
};

// ── Set up clipboard matcher on a Quill instance to preserve tables on paste ──
const setupTableClipboardMatcher = (quillInstance) => {
  if (!quillInstance || quillInstance.__tableMatcherSet) return;
  const clipboard = quillInstance.getModule("clipboard");
  clipboard.addMatcher("table", (node) => {
    return new Delta().insert({ "table-embed": node.outerHTML });
  });
  clipboard.addMatcher("td", (node) => {
    return new Delta().insert({ "table-embed": node.closest("table")?.outerHTML || node.outerHTML });
  });
  clipboard.addMatcher("th", (node) => {
    return new Delta().insert({ "table-embed": node.closest("table")?.outerHTML || node.outerHTML });
  });
  quillInstance.__tableMatcherSet = true;
};

const IMAGE_MAX_SIZE = 8 * 1024 * 1024; // 8 MB

const RichTextEditor = ({ value, onChange, placeholder, className }) => {
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > IMAGE_MAX_SIZE) {
      alert("Image is too large. Maximum size is 8 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageUrl = res.data.url;

      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", imageUrl);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "image", "table-embed"],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["clean"]
      ],
      handlers: {
        image: () => {
          fileInputRef.current?.click();
        },
        "table-embed": () => {
          const rows = parseInt(prompt("Number of rows (including header):", "4"), 10) || 4;
          const cols = parseInt(prompt("Number of columns:", "3"), 10) || 3;
          if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            const html = buildTableHtml(rows, cols);
            quill.insertEmbed(range.index, "table-embed", html);
          }
        }
      }
    }
  }), []);

  return (
    <div className={`rich-editor ${className || ""}`}>
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <ReactQuill
        ref={(ref) => {
          quillRef.current = ref;
          if (ref) {
            const editor = ref.getEditor();
            setupTableClipboardMatcher(editor);
          }
        }}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
