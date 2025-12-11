"use client";

import { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { quillModules, quillFormats } from "@/lib/quillConfig";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface TableBuilderProps {
  onInsert: (html: string) => void;
  onClose: () => void;
}

function TableBuilder({ onInsert, onClose }: TableBuilderProps) {
  const [headers, setHeaders] = useState(["Header 1", "Header 2", "Header 3"]);
  const [rows, setRows] = useState([
    ["Data 1", "Data 2", "Data 3"],
    ["Data 4", "Data 5", "Data 6"],
  ]);
  const [headerColor, setHeaderColor] = useState("#1e40af");

  const addColumn = () => {
    setHeaders([...headers, `Header ${headers.length + 1}`]);
    setRows(rows.map((row) => [...row, ""]));
  };

  const removeColumn = (index: number) => {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, i) => i !== index));
    setRows(rows.map((row) => row.filter((_, i) => i !== index)));
  };

  const addRow = () => {
    setRows([...rows, Array(headers.length).fill("")]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

  const generateHTML = () => {
    let html = `<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
  <thead>
    <tr style="background-color: ${headerColor}; color: white;">`;

    headers.forEach((header) => {
      html += `
      <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: 600;">${header}</th>`;
    });

    html += `
    </tr>
  </thead>
  <tbody>`;

    rows.forEach((row) => {
      html += `
    <tr>`;
      row.forEach((cell) => {
        html += `
      <td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`;
      });
      html += `
    </tr>`;
    });

    html += `
  </tbody>
</table>`;

    return html;
  };

  const handleInsert = () => {
    const html = generateHTML();
    onInsert(html);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Table Builder</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Header Background Color
          </label>
          <input
            type="color"
            value={headerColor}
            onChange={(e) => setHeaderColor(e.target.value)}
            className="h-10 w-24"
          />
        </div>

        <div className="mb-4 space-x-2">
          <button
            onClick={addColumn}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Column
          </button>
          <button
            onClick={addRow}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Row
          </button>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: headerColor }}>
                {headers.map((header, i) => (
                  <th key={i} className="border border-gray-300 p-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => updateHeader(i, e.target.value)}
                        className="flex-1 px-2 py-1 text-white bg-transparent border-b border-white"
                      />
                      {headers.length > 1 && (
                        <button
                          onClick={() => removeColumn(i)}
                          className="text-white hover:text-red-300"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          updateCell(rowIndex, colIndex, e.target.value)
                        }
                        className="w-full px-2 py-1 text-gray-900"
                      />
                    </td>
                  ))}
                  {rows.length > 1 && (
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete Row
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = "300px",
}: RichTextEditorProps) {
  const [showTableBuilder, setShowTableBuilder] = useState(false);
  const quillRef = useRef<any>(null);

  const handleInsertTable = (html: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      const position = range ? range.index : quill.getLength();

      quill.clipboard.dangerouslyPasteHTML(position, html);
      quill.setSelection(position + html.length);
    }
  };

  const modules = useMemo(
    () => ({
      ...quillModules,
      toolbar: {
        ...quillModules.toolbar,
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link", "image"],
          ["insertTable"],
          ["clean"],
        ],
        handlers: {
          insertTable: () => setShowTableBuilder(true),
        },
      },
    }),
    []
  );

  return (
    <>
      <style>{`
        .ql-editor {
          color: #111827 !important;
          background-color: white !important;
          min-height: ${minHeight};
        }
        .ql-editor p,
        .ql-editor h1,
        .ql-editor h2,
        .ql-editor h3,
        .ql-editor li,
        .ql-editor span,
        .ql-editor div,
        .ql-editor table,
        .ql-editor th,
        .ql-editor td {
          color: #111827 !important;
        }
        .ql-editor table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 10px 0 !important;
        }
        .ql-editor table td,
        .ql-editor table th {
          border: 1px solid #ddd !important;
          padding: 8px !important;
        }
        .ql-editor table th {
          font-weight: 600 !important;
          text-align: left !important;
        }
        .ql-toolbar button.ql-insertTable::before {
          content: '⊞';
          font-size: 18px;
        }
        .ql-toolbar .ql-insertTable .ql-tooltip::before {
          content: 'Insert Table';
        }
      `}</style>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={quillFormats}
        placeholder={placeholder}
      />

      {showTableBuilder && (
        <TableBuilder
          onInsert={handleInsertTable}
          onClose={() => setShowTableBuilder(false)}
        />
      )}
    </>
  );
}
