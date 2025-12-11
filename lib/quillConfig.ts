// Quill configuration with table support
import Quill from "quill";

// Import table module for basic table support
const TableModule = Quill.import("formats/table");
const TableCell = Quill.import("formats/table-cell");
const TableRow = Quill.import("formats/table-row");

// Register table formats
Quill.register(TableModule, true);
Quill.register(TableCell, true);
Quill.register(TableRow, true);

// Quill modules configuration
export const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
      // Note: Basic table support - you'll add custom handler
    ],
  },
  clipboard: {
    matchVisual: false,
  },
};

// Quill formats
export const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "color",
  "background",
  "align",
  "link",
  "image",
  "table",
  "table-cell",
  "table-row",
];

export default Quill;
