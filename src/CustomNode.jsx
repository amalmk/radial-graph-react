import React from "react";
import { Handle, Position } from "react-flow-renderer";

const CustomNode = ({ data }) => {
  const getNodeStyle = (level) => {
    const defaultStyle = {
      position: "relative",
      padding: "10px",
      border: "2px solid #999",
      borderRadius: "100%",
      textAlign: "center",
      fontWeight: "bold",
      backgroundColor: data.color || "#fff",
      color: "#111",
      width: "60px",
      height: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      // transform: `rotate(${angle}deg)`,
    };

    switch (level) {
      case 1:
      case 3:
        return {
          ...defaultStyle,
          borderRadius: "100%",
        };
      default:
        return {
          ...defaultStyle,
          borderRadius: "10px",
        };
    }
  };

  return (
    <>
      <div style={getNodeStyle(data.level)}>{data.label}</div>

      {/* Target Handles */}
      <Handle
        type="target"
        position="top"
        id="top"
        style={{ background: "transparent", border: "none" }}
      />
      <Handle
        type="target"
        position="left"
        id="left"
        style={{ background: "transparent", border: "none" }}
      />
      <Handle
        type="target"
        position="bottom"
        id="bottom"
        style={{ background: "transparent", border: "none" }}
      />
      <Handle
        type="target"
        position="right"
        id="right"
        style={{ background: "transparent", border: "none" }}
      />

      {/* Source Handles */}
      <Handle
        type="source"
        position="top"
        id="source-top"
        style={{ background: "transparent", border: "none" }}
      />
      <Handle
        type="source"
        position="left"
        id="source-left"
        style={{ background: "transparent", border: "none" }}
      />
      <Handle
        type="source"
        position="bottom"
        id="source-bottom"
        style={{ background: "transparent", border: "none" }}
      />
      <Handle
        type="source"
        position="right"
        id="source-right"
        style={{ background: "transparent", border: "none" }}
      />
    </>
  );
};

export default CustomNode;
