import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  MarkerType,
  ReactFlowProvider,
} from "react-flow-renderer";
import CustomNode from "./CustomNode";
import { CHART_DATA } from "./data";
import GrowingEdge from "./GrowingEdge";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  growing: GrowingEdge,
};

const calculateArcPositions = (
  nodeCount,
  radius,
  centerX,
  centerY,
  startAngle = 0,
  endAngle = 180
) => {
  const angleStep = (endAngle - startAngle) / (nodeCount - 1);

  return Array.from({ length: nodeCount }, (_, i) => {
    const angle = startAngle + i * angleStep;
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY - radius * Math.sin(radians),
    };
  });
};

const centerX = 500;
const centerY = 500;
const radii = [250, 400, 600];

const calculateHandle = (sourcePos, targetPos) => {
  const dx = targetPos.x - sourcePos.x;
  const dy = targetPos.y - sourcePos.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Angle in degrees

  // Determine source handle based on angle
  let sourceHandle = "bottom";
  if (angle >= -45 && angle < 45) sourceHandle = "right";
  else if (angle >= 45 && angle < 135) sourceHandle = "bottom";
  else if (angle >= -135 && angle < -45) sourceHandle = "top";
  else sourceHandle = "left";

  return sourceHandle;
};

const generateNodesAndEdges = () => {
  const prNodes = [];
  const irNodes = [];
  const pNodes = [];
  let edges = [];

  CHART_DATA?.children?.map((prData) => {
    prNodes.push(prData?.name);

    if (prData?.children?.length) {
      prData?.children?.map((irData) => {
        irNodes.push(irData?.name);

        edges.push({
          id: `${prData?.name}-${irData?.name}`,
          source: prData?.name,
          target: irData?.name,
          // type: "straight",
          style: { stroke: "#000", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });

        if (irData?.children?.length) {
          irData?.children?.map((pData) => {
            pNodes.push(pData?.name);
            edges.push({
              id: `${irData?.name}-${pData?.name}`,
              source: irData?.name,
              target: pData?.name,
              // type: "straight",
              style: { stroke: "#000", strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.Arrow,
              },
            });
          });
        }
      });
    }
  });

  const prPositions = calculateArcPositions(
    prNodes.length,
    radii[0],
    centerX,
    centerY
  );
  const irPositions = calculateArcPositions(
    irNodes.length,
    radii[1],
    centerX,
    centerY
  );
  const pPositions = calculateArcPositions(
    pNodes.length,
    radii[2],
    centerX,
    centerY
  );

  const nodes = [
    ...prNodes.map((label, i) => ({
      id: label,
      type: "custom",
      position: prPositions[i],
      data: { label, level: 1, center: { x: 500, y: 500 } },
    })),
    ...irNodes.map((label, i) => ({
      id: label,
      type: "custom",
      position: irPositions[i],
      data: { label, level: 2, center: { x: 500, y: 500 } },
    })),
    ...pNodes.map((label, i) => ({
      id: label,
      type: "custom",
      position: pPositions[i],
      data: { label, level: 3, center: { x: 500, y: 500 } },
    })),
  ];

  edges = edges.map((edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    const sourceHandle =
      "source-" + calculateHandle(sourceNode.position, targetNode.position);
    const targetHandle = calculateHandle(
      targetNode.position,
      sourceNode.position
    );

    return {
      ...edge,
      id: `${sourceNode.id}-${targetNode.id}`,
      sourceHandle,
      targetHandle,
      type: "growing",
    };
  });

  return { nodes, edges };
};

const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges();

const Flow = ({ setZoom }) => {
  const [highlightedEdges, setHighlightedEdges] = useState([]);
  const [highlightedNodes, setHighlightedNodes] = useState(initialNodes);

  const handleNodeClick = (nodeId) => {
    const nodesToHighlight = new Set([nodeId]);
    const edgesToHighlight = [];

    const traverseDescendants = (currentNodeId) => {
      const childEdges = initialEdges.filter(
        (edge) => edge.source === currentNodeId
      );

      childEdges.forEach((edge) => {
        edgesToHighlight.push(edge);
        nodesToHighlight.add(edge.target);
        traverseDescendants(edge.target);
      });
    };

    const traverseAncestors = (currentNodeId) => {
      const parentEdges = initialEdges.filter(
        (edge) => edge.target === currentNodeId
      );

      parentEdges.forEach((edge) => {
        edgesToHighlight.push(edge);
        nodesToHighlight.add(edge.source);
        traverseAncestors(edge.source);
      });
    };

    traverseDescendants(nodeId);
    traverseAncestors(nodeId);

    const updatedNodes = initialNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        color: nodesToHighlight.has(node.id) ? "#FFD700" : "",
      },
    }));

    setHighlightedNodes(updatedNodes);
    setHighlightedEdges(edgesToHighlight);
  };

  const handleMove = (event, viewPort) => {
    if (!event) return;
    const { zoom } = viewPort;
    setZoom(zoom);
  };

  return (
    <ReactFlow
      nodes={highlightedNodes}
      edges={highlightedEdges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeClick={(_, node) => handleNodeClick(node.id)}
      fitView
      zoomOnDoubleClick={false}
      elementsSelectable={false}
      draggable={false}
      onMove={handleMove}
      zoomOnScroll={false}
      zoomOnPinch={false}
      panOnDrag={false}
    >
      <Background />
    </ReactFlow>
  );
};

function FlowWithProvider(props) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}

const App = (props) => {
  const [key, setKey] = useState(Date.now());

  const handleResize = () => {
    setKey(Date.now());
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <FlowWithProvider key={key} {...props} />
    </div>
  );
};

export default App;
