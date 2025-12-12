"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { adminApi } from "@/lib/axios";

import "react-quill/dist/quill.snow.css";

let ReactQuill: any;
if (typeof window !== "undefined") {
  ReactQuill = require("react-quill");
}

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
`;


function TableBuilder({ onInsert }: { onInsert: (html: string) => void }) {
  const [headers, setHeaders] = useState(["Header 1", "Header 2", "Header 3"]);
  const [rows, setRows] = useState([
    ["Data 1", "Data 2", "Data 3"],
    ["Data 4", "Data 5", "Data 6"],
  ]);
  const [headerColor, setHeaderColor] = useState("#dc2626");

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
    try {
      const html = generateHTML();
      onInsert(html);
    } catch (error) {
      alert("Error inserting table: " + error);
    }
  };

  return (
    <div className="border-2 border-indigo-300 rounded-xl p-5 bg-gradient-to-br from-indigo-50 to-white shadow-lg">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Visual Table Builder</span>
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Create professional tables without coding
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Header Color:
            </label>
            <select
              value={headerColor}
              onChange={(e) => setHeaderColor(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            >
              <option value="#dc2626">🔴 Red (Government)</option>
              <option value="#2563eb">🔵 Blue (Professional)</option>
              <option value="#16a34a">🟢 Green (Success)</option>
              <option value="#4b5563">⚫ Gray (Neutral)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addColumn}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1"
            >
              <span className="text-lg">+</span> Add Column
            </button>
            <button
              type="button"
              onClick={() => removeColumn(headers.length - 1)}
              disabled={headers.length <= 1}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1"
            >
              <span className="text-lg">−</span> Remove Column
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addRow}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1"
            >
              <span className="text-lg">+</span> Add Row
            </button>
            <button
              type="button"
              onClick={() => removeRow(rows.length - 1)}
              disabled={rows.length <= 1}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1"
            >
              <span className="text-lg">−</span> Remove Row
            </button>
          </div>
        </div>
      </div>

      {/* Table Preview */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            👁️ Live Preview:
          </span>
          <span className="text-xs text-gray-500">
            Type directly in the cells below
          </span>
        </div>
        <div className="overflow-x-auto border-2 border-gray-300 rounded-lg">
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
                      className="w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-400 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                        className="w-full px-3 py-2 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all text-base flex items-center justify-center gap-2"
      >
        <span className="text-xl">✓</span>
        <span>Insert Table into Editor</span>
      </button>
    </div>
  );
}

export default function AddJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showTableGuide, setShowTableGuide] = useState(false);
  const [showTableBuilder, setShowTableBuilder] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Refs for Quill editors
  const descriptionRef = useRef<any>(null);
  const applicationRef = useRef<any>(null);
  const datesRef = useRef<any>(null);
  const applyRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };

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
  ];

  const [jobData, setJobData] = useState({
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
    <tr>
      <td style="padding: 8px;">Junior Engineer</td>
      <td style="padding: 8px;">1500</td>
      <td style="padding: 8px;">Diploma/B.Tech</td>
    </tr>
    <tr>
      <td style="padding: 8px;">Assistant Loco Pilot</td>
      <td style="padding: 8px;">1000</td>
      <td style="padding: 8px;">12th + ITI</td>
    </tr>
  </tbody>
</table>

<h3>Age Limit</h3>
<ul>
  <li>Minimum Age: 18 years</li>
  <li>Maximum Age: 33 years</li>
  <li>Age Relaxation: As per government rules</li>
</ul>

<h3>Application Fee</h3>
<ul>
  <li>General/OBC: ₹500</li>
  <li>SC/ST/PWD/Women: No Fee</li>
</ul>`,
    applicationProcess: `<h3>Selection Process</h3>
<ol>
  <li><strong>Computer Based Test (CBT)</strong> - Multiple choice questions</li>
  <li><strong>Physical Efficiency Test (PET)</strong> - For applicable posts</li>
  <li><strong>Document Verification</strong></li>
  <li><strong>Medical Examination</strong></li>
</ol>

<h3>Exam Pattern</h3>
<ul>
  <li>Total Questions: 100</li>
  <li>Total Marks: 100</li>
  <li>Duration: 90 minutes</li>
  <li>Negative Marking: 1/3 for each wrong answer</li>
</ul>`,
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
    <tr>
      <td style="padding: 8px;">Last Date to Apply</td>
      <td style="padding: 8px;">31 December 2025</td>
    </tr>
    <tr>
      <td style="padding: 8px;">Exam Date</td>
      <td style="padding: 8px;">February 2026</td>
    </tr>
    <tr>
      <td style="padding: 8px;">Admit Card Release</td>
      <td style="padding: 8px;">January 2026</td>
    </tr>
    <tr>
      <td style="padding: 8px;">Result Date</td>
      <td style="padding: 8px;">March 2026</td>
    </tr>
  </tbody>
</table>`,
    howToApply: `<h3>Application Steps</h3>
<ol>
  <li>Visit the official website: <strong>www.rrbonline.gov.in</strong></li>
  <li>Click on "Apply Online" link</li>
  <li>Register with your email and mobile number</li>
  <li>Fill the application form with correct details</li>
  <li>Upload required documents:
    <ul>
      <li>Recent photograph (50KB, JPG format)</li>
      <li>Signature (20KB, JPG format)</li>
      <li>Educational certificates</li>
    </ul>
  </li>
  <li>Pay application fee using Net Banking/Debit Card/Credit Card</li>
  <li>Submit the form and take a printout for future reference</li>
</ol>

<p><strong>Note:</strong> Keep your registration number safe for future reference.</p>`,
    tags: ["railway jobs", "government jobs", "rrb recruitment"],
    imageUrl: "",
    youtubeUrl: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    isPublished: true,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiData = {
        title: jobData.title,
        shortDescription: jobData.shortDescription,
        descriptionHtml: jobData.description,
        applicationProcess: jobData.applicationProcess,
        importantDates: jobData.importantDates,
        howToApply: jobData.howToApply,
        category: jobData.category,
        jobType: jobData.jobType,
        location: jobData.location,
        expiryDate: jobData.expiryDate,
        tags: jobData.tags,
        imageUrl: jobData.imageUrl,
        youtubeUrl: jobData.youtubeUrl,
        metaTitle: jobData.metaTitle || jobData.title,
        metaDescription: jobData.metaDescription || jobData.shortDescription,
        metaKeywords: jobData.metaKeywords,
        isPublished: jobData.isPublished,
      };



      await adminApi.createJob(apiData);
      router.push("/admin/dashboard");
    } catch (error: any) {
      alert(error.message || "Failed to create job");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setJobData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add Quill custom styles */}
      <style>{quillStyles}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Add New Job
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Add job in any language - Auto-translation enabled
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
              <div>
                <p className="font-semibold mb-2">
                  Method 1: Switch to HTML View (Recommended)
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>
                    Click the &quot;&lt;/&gt;&quot; (Source Code) button in the
                    editor toolbar
                  </li>
                  <li>Paste the HTML table code directly</li>
                  <li>
                    Click &quot;&lt;/&gt;&quot; again to switch back to visual
                    mode
                  </li>
                </ol>
              </div>

              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="font-semibold mb-2">
                  📝 Sample Table HTML (Copy & Paste):
                </p>
                <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                  {`<table border="1" style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="background-color: #dc2626;">
      <th style="padding: 8px; color: white;">Post Name</th>
      <th style="padding: 8px; color: white;">Vacancies</th>
      <th style="padding: 8px; color: white;">Salary</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px;">Junior Engineer</td>
      <td style="padding: 8px;">500</td>
      <td style="padding: 8px;">₹25,000 - ₹50,000</td>
    </tr>
    <tr>
      <td style="padding: 8px;">Assistant</td>
      <td style="padding: 8px;">300</td>
      <td style="padding: 8px;">₹20,000 - ₹40,000</td>
    </tr>
  </tbody>
</table>`}
                </pre>
              </div>

              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="font-semibold mb-2">🎨 Table Color Options:</p>
                <div className="space-y-1 text-xs">
                  <p>
                    •{" "}
                    <span className="font-mono bg-red-600 text-white px-2 py-1 rounded">
                      #dc2626
                    </span>{" "}
                    Red Header (Government Jobs)
                  </p>
                  <p>
                    •{" "}
                    <span className="font-mono bg-blue-600 text-white px-2 py-1 rounded">
                      #2563eb
                    </span>{" "}
                    Blue Header (Professional)
                  </p>
                  <p>
                    •{" "}
                    <span className="font-mono bg-green-600 text-white px-2 py-1 rounded">
                      #16a34a
                    </span>{" "}
                    Green Header (Success)
                  </p>
                  <p>
                    •{" "}
                    <span className="font-mono bg-gray-600 text-white px-2 py-1 rounded">
                      #4b5563
                    </span>{" "}
                    Gray Header (Neutral)
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">✨ Pro Tips:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Use{" "}
                    <code className="bg-gray-200 px-1 rounded">
                      border=&quot;1&quot;
                    </code>{" "}
                    for table borders
                  </li>
                  <li>
                    Add{" "}
                    <code className="bg-gray-200 px-1 rounded">
                      padding: 8px;
                    </code>{" "}
                    for better spacing
                  </li>
                  <li>
                    Use background colors for headers to make them stand out
                  </li>
                  <li>
                    Check the example data already filled in the form below
                  </li>
                </ul>
              </div>
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
                  placeholder="e.g., RRB is hiring for 5000+ posts including Group D, Junior Engineer, and Assistant Loco Pilot positions across India."
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
                  placeholder="e.g., railway jobs, government jobs, rrb recruitment"
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
                    <span className="text-xs text-gray-500 ml-2">
                      (Detailed information about the job, posts available, age
                      limit, etc.)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setShowTableBuilder(
                        showTableBuilder === "description"
                          ? null
                          : "description"
                      )
                    }
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    {showTableBuilder === "description" ? (
                      <>
                        <span>✕</span>
                        <span>Close Builder</span>
                      </>
                    ) : (
                      <>
                        <span>📊</span>
                        <span>Add Table</span>
                      </>
                    )}
                  </button>
                </div>

                {showTableBuilder === "description" && (
                  <div className="mb-3">
                    <TableBuilder
                      onInsert={(html) => {
                        console.log("🔧 Insert table called");
                        console.log("📝 HTML:", html);
                        console.log("📌 Ref:", descriptionRef.current);

                        if (!descriptionRef.current) {
                          console.error("❌ Ref is null");
                          alert("Editor not ready. Please try again.");
                          return;
                        }

                        const quill = descriptionRef.current.getEditor();
                        console.log("✏️ Quill instance:", quill);

                        if (quill) {
                          const range = quill.getSelection();
                          const position = range
                            ? range.index
                            : quill.getLength();
                          console.log("📍 Insert position:", position);

                          quill.clipboard.dangerouslyPasteHTML(position, html);
                          console.log("✅ Table inserted successfully");
                        } else {
                          console.error("❌ Could not get Quill editor");
                          alert("Could not access editor. Please try again.");
                        }
                        setShowTableBuilder(null);
                      }}
                    />
                  </div>
                )}

                {isMounted && ReactQuill && (
                  <ReactQuill
                    ref={descriptionRef}
                    theme="snow"
                    value={jobData.description}
                    onChange={(value: string) =>
                      updateField("description", value)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter detailed job description including number of posts, department-wise breakdown, age limit, etc."
                    style={{ height: "200px", marginBottom: "50px" }}
                  />
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Application Process
                    <span className="text-xs text-gray-500 ml-2">
                      (Steps to apply, selection process, exam pattern)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setShowTableBuilder(
                        showTableBuilder === "applicationProcess"
                          ? null
                          : "applicationProcess"
                      )
                    }
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    {showTableBuilder === "applicationProcess" ? (
                      <>
                        <span>✕</span>
                        <span>Close Builder</span>
                      </>
                    ) : (
                      <>
                        <span>📊</span>
                        <span>Add Table</span>
                      </>
                    )}
                  </button>
                </div>

                {showTableBuilder === "applicationProcess" && (
                  <div className="mb-3">
                    <TableBuilder
                      onInsert={(html) => {
                        const quill = applicationRef.current?.getEditor();
                        if (quill) {
                          const range = quill.getSelection() || {
                            index: quill.getLength(),
                          };
                          quill.clipboard.dangerouslyPasteHTML(
                            range.index,
                            html
                          );
                        }
                        setShowTableBuilder(null);
                      }}
                    />
                  </div>
                )}

                {isMounted && ReactQuill && (
                  <ReactQuill
                    ref={applicationRef}
                    theme="snow"
                    value={jobData.applicationProcess}
                    onChange={(value: string) =>
                      updateField("applicationProcess", value)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter application process details: online/offline mode, registration steps, selection stages, exam pattern, etc."
                    style={{ height: "150px", marginBottom: "50px" }}
                  />
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Important Dates
                    <span className="text-xs text-gray-500 ml-2">
                      (Application start/end date, exam date, result date)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setShowTableBuilder(
                        showTableBuilder === "importantDates"
                          ? null
                          : "importantDates"
                      )
                    }
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    {showTableBuilder === "importantDates" ? (
                      <>
                        <span>✕</span>
                        <span>Close Builder</span>
                      </>
                    ) : (
                      <>
                        <span>📊</span>
                        <span>Add Table</span>
                      </>
                    )}
                  </button>
                </div>

                {showTableBuilder === "importantDates" && (
                  <div className="mb-3">
                    <TableBuilder
                      onInsert={(html) => {
                        const quill = datesRef.current?.getEditor();
                        if (quill) {
                          const range = quill.getSelection() || {
                            index: quill.getLength(),
                          };
                          quill.clipboard.dangerouslyPasteHTML(
                            range.index,
                            html
                          );
                        }
                        setShowTableBuilder(null);
                      }}
                    />
                  </div>
                )}

                {isMounted && ReactQuill && (
                  <ReactQuill
                    ref={datesRef}
                    theme="snow"
                    value={jobData.importantDates}
                    onChange={(value: string) =>
                      updateField("importantDates", value)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter important dates: Application Start Date, Last Date, Exam Date, Admit Card Date, Result Date, etc."
                    style={{ height: "150px", marginBottom: "50px" }}
                  />
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    How to Apply
                    <span className="text-xs text-gray-500 ml-2">
                      (Detailed application instructions)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setShowTableBuilder(
                        showTableBuilder === "howToApply" ? null : "howToApply"
                      )
                    }
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    {showTableBuilder === "howToApply" ? (
                      <>
                        <span>✕</span>
                        <span>Close Builder</span>
                      </>
                    ) : (
                      <>
                        <span>📊</span>
                        <span>Add Table</span>
                      </>
                    )}
                  </button>
                </div>

                {showTableBuilder === "howToApply" && (
                  <div className="mb-3">
                    <TableBuilder
                      onInsert={(html) => {
                        const quill = applyRef.current?.getEditor();
                        if (quill) {
                          const range = quill.getSelection() || {
                            index: quill.getLength(),
                          };
                          quill.clipboard.dangerouslyPasteHTML(
                            range.index,
                            html
                          );
                        }
                        setShowTableBuilder(null);
                      }}
                    />
                  </div>
                )}

                {isMounted && ReactQuill && (
                  <ReactQuill
                    ref={applyRef}
                    theme="snow"
                    value={jobData.howToApply}
                    onChange={(value: string) =>
                      updateField("howToApply", value)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter step-by-step application instructions: Visit official website, register, fill form, upload documents, pay fee, submit, etc."
                    style={{ height: "150px", marginBottom: "50px" }}
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
                    placeholder="e.g., railway jobs, government jobs, recruitment 2025"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-navy-900 hover:bg-navy-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {isLoading ? "Creating..." : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
