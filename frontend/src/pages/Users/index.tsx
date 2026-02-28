import React from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

// ✅ Import types properly
import type { TreeNode } from "primereact/treenode";
import type { TreeTableTogglerTemplateOptions } from "primereact/treetable";

const UserPage: React.FC = () => {
  const nodes: TreeNode[] = [
    {
      key: "0",
      data: { name: "Applications", size: "100kb", type: "Folder" },
      children: [
        {
          key: "0-0",
          data: { name: "React", size: "25kb", type: "Folder" },
          children: [
            { key: "0-0-0", data: { name: "react.app", size: "10kb", type: "Application" } },
            { key: "0-0-1", data: { name: "native.app", size: "10kb", type: "Application" } },
            { key: "0-0-2", data: { name: "mobile.app", size: "5kb", type: "Application" } },
          ],
        },
        { key: "0-1", data: { name: "editor.app", size: "25kb", type: "Application" } },
        { key: "0-2", data: { name: "settings.app", size: "50kb", type: "Application" } },
      ],
    },
  ];

  const header = <h3>Users</h3>;
  const footer = <small>End of Tree Table</small>;

  // Use _options to ignore unused variable warning
  const togglerTemplate = (node: TreeNode, _options: TreeTableTogglerTemplateOptions) => (
    <span>{node.data?.name}</span>
  );

  const actionTemplate = (node: TreeNode) => (
    <Button label="Edit" icon="pi pi-pencil" className="p-button-sm" />
  );

  return (
    <div className="card">
      <TreeTable
        value={nodes}
        header={header}
        footer={footer}
        togglerTemplate={togglerTemplate}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="name" header="Name" expander />
        <Column field="size" header="Size" />
        <Column field="type" header="Type" />
        <Column body={actionTemplate} header="Actions" style={{ width: "10rem" }} />
      </TreeTable>
    </div>
  );
};

export default UserPage;