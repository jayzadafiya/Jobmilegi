export default function registerTableBlot(Quill: any) {
  const BlockEmbed = Quill.import("blots/block/embed");

  class HTMLTableBlot extends BlockEmbed {
    static create(html: string) {
      const node = super.create();

      // Create wrapper for table with edit button
      const tableWrapper = document.createElement("div");
      tableWrapper.className = "table-content-wrapper";
      tableWrapper.innerHTML = html;
      tableWrapper.setAttribute("contenteditable", "false");

      // Create edit button
      const editBtn = document.createElement("button");
      editBtn.className = "table-edit-btn";
      editBtn.innerHTML = "✏️ Edit";
      editBtn.setAttribute("type", "button");
      editBtn.setAttribute("contenteditable", "false");
      editBtn.style.pointerEvents = "auto"; // Ensure button is clickable
      
      // Add click handler
      editBtn.onclick = (e) => {
        console.log("🔵 Edit button clicked!", e);
        e.preventDefault();
        e.stopPropagation();
        
        // Dispatch custom event that JobForm will listen to
        const event = new CustomEvent("editTable", {
          detail: { html, node },
          bubbles: true,
        });
        console.log("🟢 Dispatching editTable event", event);
        node.dispatchEvent(event);
      };

      node.appendChild(tableWrapper);
      node.appendChild(editBtn);

      return node;
    }

    static value(node: HTMLElement) {
      const wrapper = node.querySelector(".table-content-wrapper");
      return wrapper ? wrapper.innerHTML : "";
    }
  }
  HTMLTableBlot.blotName = "html-table";
  HTMLTableBlot.tagName = "div";
  HTMLTableBlot.className = "ql-html-table";

  Quill.register("formats/html-table", HTMLTableBlot, true);
  console.log("✅ Custom Table Blot Registered with Edit Button");
}
