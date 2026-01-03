"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import registerTableBlot from "./TableBlot";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as any;

// Custom styles for Quill editor
const quillStyles = `
  .ql-editor {
    color: #111827 !important;
    background-color: white !important;
    min-height: 150px;
  }
  .ql-editor p,
  .ql-editor h1,
  .ql-editor h2,
  .ql-editor h3,
  .ql-editor h4,
  .ql-editor h5,
  .ql-editor h6,
  .ql-editor li,
  .ql-editor span,
  .ql-editor div,
  .ql-editor table,
  .ql-editor th,
  .ql-editor td {
    color: #111827 !important;
  }
  .ql-editor.ql-blank::before {
    color: #9ca3af !important;
  }
  .ql-toolbar {
    background-color: #f9fafb;
    border-color: #d1d5db !important;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .ql-container {
    border-color: #d1d5db !important;
    background-color: white !important;
  }
  /* Preserve table styles */
  .ql-editor table {
    border-collapse: collapse !important;
    width: 100% !important;
  }
  .ql-editor table td,
  .ql-editor table th {
    border: 1px solid #ddd !important;
    padding: 8px !important;
  }
  /* Table edit button styles */
  .ql-html-table {
    position: relative;
    margin: 10px 0;
    padding: 5px;
    border-radius: 8px;
    transition: background-color 0.2s;
  }
  .ql-html-table:hover {
    background-color: #f3f4f6;
  }
  .ql-html-table .table-edit-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 10px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    opacity: 0;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 5;
  }
  .ql-html-table:hover .table-edit-btn {
    opacity: 1;
  }
  .ql-html-table .table-edit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  .ql-html-table .table-content-wrapper {
    position: relative;
  }
`;


function TableBuilder({
  onInsert,
  initialData,
}: {
  onInsert: (html: string) => void;
  initialData?: {
    headers: string[];
    rows: string[][];
    headerColor: string;
  };
}) {
  const [headers, setHeaders] = useState(
    initialData?.headers || ["Header 1", "Header 2", "Header 3"]
  );
  const [rows, setRows] = useState(
    initialData?.rows || [
      ["Data 1", "Data 2", "Data 3"],
      ["Data 4", "Data 5", "Data 6"],
    ]
  );
  const [headerColor, setHeaderColor] = useState(
    initialData?.headerColor || "#dc2626"
  );

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
    let html = `<table border="1" style="width: 100%; border-collapse: collapse;">\n  <thead>\n    <tr style="background-color: ${headerColor};">\n`;

    headers.forEach((header) => {
      html += `      <th style="padding: 8px; color: white; text-align: left;">${header}</th>\n`;
    });

    html += `    </tr>\n  </thead>\n  <tbody>\n`;

    rows.forEach((row) => {
      html += `    <tr>\n`;
      row.forEach((cell) => {
        html += `      <td style="padding: 8px;">${cell}</td>\n`;
      });
      html += `    </tr>\n`;
    });

    html += `  </tbody>\n</table>`;

    return html;
  };

  const insertTable = () => {
    const html = generateHTML();
    onInsert(html);
  };

  return (
    <div className="border border-indigo-200 rounded-lg p-3 bg-gradient-to-br from-indigo-50/50 to-white shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">
              Visual Table Builder
            </h4>
            <p className="text-xs text-gray-500">
              Create tables without coding
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">
            Header:
          </label>
          <select
            value={headerColor}
            onChange={(e) => setHeaderColor(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-gray-900 font-medium focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
          >
            <option value="#dc2626">🔴 Red</option>
            <option value="#2563eb">🔵 Blue</option>
            <option value="#16a34a">🟢 Green</option>
            <option value="#4b5563">⚫ Gray</option>
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          onClick={addColumn}
          className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded shadow-sm hover:shadow transition-all flex items-center gap-1"
        >
          <span>+</span> Column
        </button>
        <button
          type="button"
          onClick={() => removeColumn(headers.length - 1)}
          disabled={headers.length <= 1}
          className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-medium rounded shadow-sm hover:shadow transition-all flex items-center gap-1"
        >
          <span>−</span> Column
        </button>
        <button
          type="button"
          onClick={addRow}
          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded shadow-sm hover:shadow transition-all flex items-center gap-1"
        >
          <span>+</span> Row
        </button>
        <button
          type="button"
          onClick={() => removeRow(rows.length - 1)}
          disabled={rows.length <= 1}
          className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-medium rounded shadow-sm hover:shadow transition-all flex items-center gap-1"
        >
          <span>−</span> Row
        </button>
      </div>

      {/* Table Preview */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="text-xs font-semibold text-gray-700">
            👁️ Preview:
          </span>
          <span className="text-xs text-gray-500">
            Edit cells directly
          </span>
        </div>
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: headerColor }}>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="p-0 border border-white border-opacity-30"
                  >
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => updateHeader(index, e.target.value)}
                      className="w-full px-2 py-1.5 bg-white text-gray-900 placeholder-gray-400 font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      placeholder={`Header ${index + 1}`}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="p-0 border border-gray-300">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          updateCell(rowIndex, colIndex, e.target.value)
                        }
                        className="w-full px-2 py-1.5 bg-white text-gray-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        placeholder={`Cell ${rowIndex + 1}-${colIndex + 1}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insert Button */}
      <button
        type="button"
        onClick={insertTable}
        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-1.5"
      >
        <span className="text-base">✓</span>
        <span>Insert Table</span>
      </button>
    </div>
  );
}

// Parse table HTML to extract data for editing
function parseTableHTML(html: string): {
  headers: string[];
  rows: string[][];
  headerColor: string;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const table = doc.querySelector("table");

  if (!table) {
    return {
      headers: ["Header 1"],
      rows: [["Data 1"]],
      headerColor: "#dc2626",
    };
  }

  // Extract header color
  const thead = table.querySelector("thead tr");
  const headerColor =
    thead?.getAttribute("style")?.match(/background-color:\s*([^;]+)/)?.[1] ||
    "#dc2626";

  // Extract headers
  const headerCells = table.querySelectorAll("thead th");
  const headers = Array.from(headerCells).map(
    (th) => th.textContent?.trim() || ""
  );

  // Extract rows
  const rowElements = table.querySelectorAll("tbody tr");
  const rows = Array.from(rowElements).map((tr) => {
    const cells = tr.querySelectorAll("td");
    return Array.from(cells).map((td) => td.textContent?.trim() || "");
  });

  return {
    headers: headers.length > 0 ? headers : ["Header 1"],
    rows: rows.length > 0 ? rows : [["Data 1"]],
    headerColor,
  };
}

interface JobData {
  title: string;
  shortDescription: string;
  category: string;
  jobType: string;
  location: string;
  expiryDate: string;
  description: string;
  applicationProcess: string;
  importantDates: string;
  howToApply: string;
  tags: string[];
  imageUrl: string;
  youtubeUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  isPublished: boolean;
}

interface JobFormProps {
  initialData?: JobData;
  onSubmit: (data: JobData) => Promise<void>;
  isSaving: boolean;
  onCancel: () => void;
  pageTitle: string;
}

const defaultJobData: JobData = {
  title: "Railway Recruitment 2025 - 5000+ Posts",
  shortDescription:
    "RRB is hiring for 5000+ posts including Group D, Junior Engineer, and Assistant Loco Pilot positions across India.",
  category: "railway",
  jobType: "recruitment",
  location: "All India",
  expiryDate: "2025-12-31",
  description: `<h3>Post Details</h3>...`, // Truncated for brevity in default, will be overwritten by real default or API data
  applicationProcess: `<h3>Selection Process</h3>...`,
  importantDates: `<table>...</table>`,
  howToApply: `<h3>Application Steps</h3>...`,
  tags: ["railway jobs", "government jobs", "rrb recruitment"],
  imageUrl: "",
  youtubeUrl: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
  isPublished: true,
};

// Full default strings for clean new entries
const fullDefaultData: JobData = {
  title: "Railway Recruitment 2025 - 5000+ Posts",
  shortDescription:
    "RRB is hiring for 5000+ posts including Group D, Junior Engineer, and Assistant Loco Pilot positions across India.",
  category: "railway",
  jobType: "recruitment",
  location: "All India",
  expiryDate: "2025-12-31",
  description: `<h3>Post Details</h3>
<table border="1" style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="background-color: #f3f4f6;">
      <th style="padding: 8px; text-align: left;">Post Name</th>
      <th style="padding: 8px; text-align: left;">Total Posts</th>
      <th style="padding: 8px; text-align: left;">Qualification</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px;">Group D Posts</td>
      <td style="padding: 8px;">2500</td>
      <td style="padding: 8px;">10th Pass</td>
    </tr>
  </tbody>
</table>`,
  applicationProcess: `<h3>Selection Process</h3>
<ol>
  <li><strong>Computer Based Test (CBT)</strong></li>
  <li><strong>Physical Efficiency Test (PET)</strong></li>
  <li><strong>Document Verification</strong></li>
</ol>`,
  importantDates: `<table border="1" style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="background-color: #f3f4f6;">
      <th style="padding: 8px; text-align: left;">Event</th>
      <th style="padding: 8px; text-align: left;">Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px;">Application Start Date</td>
      <td style="padding: 8px;">01 December 2025</td>
    </tr>
  </tbody>
</table>`,
  howToApply: `<h3>Application Steps</h3>
<ol>
  <li>Visit the official website</li>
  <li>Register and fill form</li>
  <li>Pay fee and submit</li>
</ol>`,
  tags: ["railway jobs", "government jobs"],
  imageUrl: "",
  youtubeUrl: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
  isPublished: true,
};

export default function JobForm({
  initialData,
  onSubmit,
  isSaving,
  onCancel,
  pageTitle,
}: JobFormProps) {
  const [showTableGuide, setShowTableGuide] = useState(false);
  const [showTableBuilder, setShowTableBuilder] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isQuillReady, setIsQuillReady] = useState(false);
  
  // State for editing tables
  const [editingTable, setEditingTable] = useState<{
    editorKey: string;
    data: { headers: string[]; rows: string[][]; headerColor: string };
    node: HTMLElement | null;
  } | null>(null);

  // Refs for Quill editors
  const descriptionRef = useRef<any>(null);
  const applicationRef = useRef<any>(null);
  const datesRef = useRef<any>(null);
  const applyRef = useRef<any>(null);

  const quillClassRef = useRef<any>(null);

  const [jobData, setJobData] = useState<JobData>(
    initialData || fullDefaultData
  );

  useEffect(() => {
    setIsMounted(true);
    const registerQuill = async () => {
      if (typeof window === "undefined") return;

      try {
        const { default: RQ, Quill: NamedQuill } = await import("react-quill");
        const Quill = NamedQuill || RQ.Quill;

        if (Quill) {
          quillClassRef.current = Quill;

          registerTableBlot(Quill);

          const Icons = Quill.import("ui/icons");
          Icons["table-action"] = `<svg viewBox="0 0 18 18">
            <rect class="ql-stroke" height="12" width="12" x="3" y="3"></rect>
            <rect class="ql-fill" height="2" width="3" x="5" y="5"></rect>
            <rect class="ql-fill" height="2" width="4" x="9" y="5"></rect>
            <rect class="ql-fill" height="3" width="3" x="5" y="8"></rect>
            <rect class="ql-fill" height="3" width="4" x="9" y="8"></rect>
          </svg>`;

          setIsQuillReady(true);
        }
      } catch (error) {
        console.error("Failed to register Quill blots:", error);
        setIsQuillReady(true);
      }
    };
    registerQuill();
  }, []);

  useEffect(() => {
    if (initialData) {
      setJobData(initialData);
    }
  }, [initialData]);

  // Listen for table edit events
  useEffect(() => {
    console.log("🎧 Setting up editTable event listener");
    
    const handleEditTable = (e: Event) => {
      console.log("🟡 editTable event received!", e);
      const customEvent = e as CustomEvent;
      const { html, node } = customEvent.detail;
      console.log("📦 Event detail:", { html, node });

      // Parse the table HTML
      const tableData = parseTableHTML(html);
      console.log("📊 Parsed table data:", tableData);

      // Determine which editor this table belongs to
      // Walk up the DOM tree to find the ReactQuill wrapper with an ID
      let editorId = "";
      let currentElement = node as HTMLElement;
      
      while (currentElement && !editorId) {
        if (currentElement.id && currentElement.id.startsWith("editor-")) {
          editorId = currentElement.id;
          break;
        }
        currentElement = currentElement.parentElement as HTMLElement;
      }
      
      console.log("🆔 Editor ID:", editorId);

      let editorKey = "";
      if (editorId?.includes("description")) editorKey = "description";
      else if (editorId?.includes("application")) editorKey = "applicationProcess";
      else if (editorId?.includes("dates")) editorKey = "importantDates";
      else if (editorId?.includes("apply")) editorKey = "howToApply";
      
      console.log("🔑 Editor key:", editorKey);

      if (editorKey) {
        console.log("✅ Setting editing table state");
        setEditingTable({
          editorKey,
          data: tableData,
          node: node.closest(".ql-html-table"),
        });
        setShowTableBuilder(editorKey);
      } else {
        console.warn("⚠️ No valid editor key found");
      }
    };

    document.addEventListener("editTable", handleEditTable);
    console.log("✅ Event listener attached to document");

    return () => {
      document.removeEventListener("editTable", handleEditTable);
      console.log("🗑️ Event listener removed");
    };
  }, []);

  const insertHtmlToEditor = (ref: any, html: string, editorId: string) => {
    let quill;

    try {
      if (ref.current) {
        if (typeof ref.current.getEditor === "function") {
          quill = ref.current.getEditor();
        } else if (ref.current.editor) {
          quill = ref.current.editor;
        } else {
          quill = ref.current;
        }
      }

      if (!quill && quillClassRef.current && typeof document !== "undefined") {
        const editorEl = document.getElementById(editorId);
        if (editorEl) {
          const container = editorEl.querySelector(".ql-container");
          if (container) {
            quill = quillClassRef.current.find(container);
          } else {
            quill = quillClassRef.current.find(editorEl);
          }
        }
      }

      if (!quill) {
        console.error(`Quill instance not found for ${editorId}`);
        alert(
          `Editor is not ready. Please click inside the box once and try again.`
        );
        return;
      }

      if (quill) {
        // Check if we're editing an existing table
        if (editingTable && editingTable.node) {
          // Find the blot for the node we're editing
          const blot = quillClassRef.current.find(editingTable.node);
          if (blot) {
            const index = quill.getIndex(blot);
            // Remove the old table
            quill.deleteText(index, 1);
            // Insert the new table at the same position
            quill.insertEmbed(index, "html-table", html, "user");
            quill.setSelection(index + 1);
            console.log(`✅ Table updated in ${editorId}`);
          }
          // Clear editing state
          setEditingTable(null);
        } else {
          // Normal insert mode
          const range = quill.getSelection(true);
          if (range) {
            quill.insertEmbed(range.index, "html-table", html, "user");
            quill.setSelection(range.index + 1); // Move cursor after table
          } else {
            const length = quill.getLength();
            quill.insertEmbed(length, "html-table", html, "user");
          }
          console.log(`✅ Table inserted into ${editorId}`);
        }
      }
    } catch (err) {
      console.error("Error inserting HTML:", err);
      alert("Failed to insert table. " + (err as any).message);
    }
  };

  const createModules = (key: string) => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link"],
        ["clean"],
        ["table-action"],
      ],
      handlers: {
        "table-action": () => {
          setShowTableBuilder((prev) => (prev === key ? null : key));
        },
      },
    },
  });

  const modulesDescription = useMemo(() => createModules("description"), []);
  const modulesApplication = useMemo(
    () => createModules("applicationProcess"),
    []
  );
  const modulesDates = useMemo(() => createModules("importantDates"), []);
  const modulesHowTo = useMemo(() => createModules("howToApply"), []);

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "color",
    "background",
    "table-container",
    "table-head",
    "table-body",
    "table-row",
    "table-cell",
    "table-header-cell",
    "html-table", // Add custom embed format
  ];

  const categories = [
    "railway",
    "ssc",
    "bank",
    "police",
    "stateGovt",
    "defenseJobs",
    "teachingJobs",
    "engineeringJobs",
    "other",
  ];

  const jobTypes = [
    "latest",
    "admitCard",
    "result",
    "answerKey",
    "notification",
    "exam",
    "recruitment",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(jobData);
  };

  const updateField = (field: keyof JobData, value: any) => {
    setJobData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{quillStyles}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {pageTitle}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {initialData ? "Update job details" : "Add job in any language"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Table Guide */}
        {showTableGuide && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-blue-900">
                📋 How to Add Tables in Rich Text Editors
              </h3>
              <button
                type="button"
                onClick={() => setShowTableGuide(false)}
                className="text-blue-700 hover:text-blue-900 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm text-blue-900">
              <p>
                Use the Visual Table Builder to create tables, or switch to code
                view (&lt;/&gt;) to paste HTML tables directly.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Job Information
            </h2>
            <button
              type="button"
              onClick={() => setShowTableGuide(!showTableGuide)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
            >
              {showTableGuide ? "Hide" : "Show"} Table Guide 📋
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={jobData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g., Railway Recruitment 2025 - 5000+ Posts"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description * (Max 500 characters)
                </label>
                <textarea
                  required
                  value={jobData.shortDescription}
                  onChange={(e) =>
                    updateField("shortDescription", e.target.value)
                  }
                  placeholder="e.g., RRB is hiring for 5000+ posts..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {jobData.shortDescription.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={jobData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() +
                        cat
                          .slice(1)
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  required
                  value={jobData.jobType}
                  onChange={(e) => updateField("jobType", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                >
                  <option value="">Select Job Type</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() +
                        type
                          .slice(1)
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={jobData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g., All India / Mumbai / Delhi"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={jobData.expiryDate}
                  onChange={(e) => updateField("expiryDate", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={jobData.tags.join(", ")}
                  onChange={(e) =>
                    updateField(
                      "tags",
                      e.target.value.split(",").map((t) => t.trim())
                    )
                  }
                  placeholder="e.g., railway jobs, government jobs"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={jobData.imageUrl}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                  placeholder="e.g., https://example.com/image.jpg"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL (Optional)
                </label>
                <input
                  type="url"
                  value={jobData.youtubeUrl}
                  onChange={(e) => updateField("youtubeUrl", e.target.value)}
                  placeholder="e.g., https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Rich Text Editors */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                </div>

                {showTableBuilder === "description" && (
                  <div className="mb-3">
                    <TableBuilder
                      initialData={
                        editingTable?.editorKey === "description"
                          ? editingTable.data
                          : undefined
                      }
                      onInsert={(html) => {
                        insertHtmlToEditor(
                          descriptionRef,
                          html,
                          "editor-description"
                        );
                        setShowTableBuilder(null);
                      }}
                    />
                  </div>
                )}

                {isMounted && isQuillReady && ReactQuill && (
                  <ReactQuill
                    id="editor-description"
                    ref={(el: any) => {
                      descriptionRef.current = el;
                    }}
                    theme="snow"
                    value={jobData.description}
                    onChange={(value: string) =>
                      updateField("description", value)
                    }
                    modules={modulesDescription}
                    formats={quillFormats}
                    className="h-48 mb-12"
                    {...({ "data-gramm": "false" } as any)}
                  />
                )}
              </div>

              {/* Application Process */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Application Process
                  </label>
                </div>

                {showTableBuilder === "applicationProcess" && (
                  <div className="mb-3">
                    <TableBuilder
                      initialData={
                        editingTable?.editorKey === "applicationProcess"
                          ? editingTable.data
                          : undefined
                      }
                      onInsert={(html) => {
                        insertHtmlToEditor(
                          applicationRef,
                          html,
                          "editor-application"
                        );
                        setShowTableBuilder(null);
                      }}
                    />
                  </div>
                )}

                {isMounted && isQuillReady && ReactQuill && (
                  <ReactQuill
                    id="editor-application"
                    ref={(el: any) => {
                      applicationRef.current = el;
                    }}
                    theme="snow"
                    value={jobData.applicationProcess}
                    onChange={(value: string) =>
                      updateField("applicationProcess", value)
                    }
                    modules={modulesApplication}
                    formats={quillFormats}
                    className="h-48 mb-12"
                    {...({ "data-gramm": "false" } as any)}
                  />
                )}
              </div>

              {/* Important Dates */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Important Dates
                  </label>
                </div>

                {showTableBuilder === "importantDates" && (
                  <div className="mb-3">
                    <TableBuilder
                      initialData={
                        editingTable?.editorKey === "importantDates"
                          ? editingTable.data
                          : undefined
                      }
                      onInsert={(html) => {
                        insertHtmlToEditor(datesRef, html, "editor-dates");
                        setShowTableBuilder(null);
                      }}
                    />
                  </div>
                )}

                {isMounted && isQuillReady && ReactQuill && (
                  <ReactQuill
                    id="editor-dates"
                    ref={(el: any) => {
                      datesRef.current = el;
                    }}
                    theme="snow"
                    value={jobData.importantDates}
                    onChange={(value: string) =>
                      updateField("importantDates", value)
                    }
                    modules={modulesDates}
                    formats={quillFormats}
                    className="h-48 mb-12"
                    {...({ "data-gramm": "false" } as any)}
                  />
                )}
              </div>

              {/* How to Apply */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    How to Apply
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setShowTableBuilder(
                        showTableBuilder === "howToApply" ? null : "howToApply"
                      )
                    }
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm rounded-lg font-semibold shadow-md transition-all flex items-center gap-2"
                  >
                    {showTableBuilder === "howToApply"
                      ? "✕ Close Builder"
                      : "📊 Add Table"}
                  </button>
                </div>

                {showTableBuilder === "howToApply" && (
                  <div className="mb-3">
                    <TableBuilder
                      initialData={
                        editingTable?.editorKey === "howToApply"
                          ? editingTable.data
                          : undefined
                      }
                      onInsert={(html) => {
                        insertHtmlToEditor(applyRef, html, "editor-apply");
                        setShowTableBuilder(null);
                      }}
                    />
                  </div>
                )}

                {isMounted && isQuillReady && ReactQuill && (
                  <ReactQuill
                    id="editor-apply"
                    ref={(el: any) => {
                      applyRef.current = el;
                    }}
                    theme="snow"
                    value={jobData.howToApply}
                    onChange={(value: string) =>
                      updateField("howToApply", value)
                    }
                    modules={modulesHowTo}
                    formats={quillFormats}
                    className="h-48 mb-12"
                    {...({ "data-gramm": "false" } as any)}
                  />
                )}
              </div>
            </div>

            {/* Flags */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={jobData.isPublished}
                  onChange={(e) => updateField("isPublished", e.target.checked)}
                  className="rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Publish Job (Make it visible on website)
                </span>
              </label>
            </div>

            {/* SEO Fields */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                SEO Settings (Optional)
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title (Max 60 characters)
                  </label>
                  <input
                    type="text"
                    value={jobData.metaTitle}
                    onChange={(e) => updateField("metaTitle", e.target.value)}
                    placeholder="Leave empty to use job title"
                    maxLength={60}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {jobData.metaTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description (Max 160 characters)
                  </label>
                  <textarea
                    value={jobData.metaDescription}
                    onChange={(e) =>
                      updateField("metaDescription", e.target.value)
                    }
                    placeholder="Leave empty to use short description"
                    maxLength={160}
                    rows={2}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {jobData.metaDescription.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={jobData.metaKeywords.join(", ")}
                    onChange={(e) =>
                      updateField(
                        "metaKeywords",
                        e.target.value.split(",").map((k) => k.trim())
                      )
                    }
                    placeholder="e.g., railway jobs, government jobs"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-navy-900 hover:bg-navy-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {isSaving ? "Saving..." : "Save Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
