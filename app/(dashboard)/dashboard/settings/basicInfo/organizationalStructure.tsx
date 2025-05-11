import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OrganizationChart } from "primereact/organizationchart";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { v4 as uuidv4 } from "uuid";

interface OrgNode {
  id: string;
  title: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  branch?: {
    name: string;
  } | null;
  children?: OrgNode[];
}

interface TreeProps {
  data: OrgNode[];
}

const OrganizationalTree: React.FC<TreeProps> = ({ data: initialData =[] }) => {
  const [data, setData] = useState<OrgNode[]>(initialData);
  const [selection, setSelection] = useState<OrgNode[]>([]);
console.log(data );
  const addChild = (parentId: string) => {
    const newChild: OrgNode = {
      id: uuidv4(),
      title: "New Position",
      user: {
        firstName: "First",
        lastName: "Last",
        email: "new@domain.com",
      },
      branch: {
        name: "New Branch",
      },
      children: [],
    };

    const addToNode = (nodes: OrgNode[]): OrgNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          const updatedChildren = node.children ? [...node.children, newChild] : [newChild];
          return { ...node, children: updatedChildren };
        } else if (node.children) {
          return { ...node, children: addToNode(node.children) };
        }
        return node;
      });
    };

    const updatedData = addToNode(data);
    setData(updatedData);
  };

  const nodeTemplate = (node: OrgNode) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="p-2 rounded-sm mb-2 bg-white shadow-md dark:bg-gray-800 text-center text-lg font-semibold">{node.title}</div>
        {node.user && (
          <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            {node.user.firstName} {node.user.lastName}
            <br />
            <span className="text-xs">{node.user.email}</span>
          </div>
        )}
        {node.branch && (
          <div className="text-xs text-gray-500 mt-1">Branch: {node.branch.name}</div>
        )}
        <div className="mt-3">
          <Button size="sm" onClick={() => addChild(node.id)}>
            + Add Child
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="overflow-x-auto py-10">
      <OrganizationChart
        value={data}
        selectionMode="single"
        selection={selection}
        // onSelectionChange={(e) => setSelection(e.data)}
        nodeTemplate={nodeTemplate}
        className="organization-chart"
      />
    </div>
  );
};

export default OrganizationalTree;
