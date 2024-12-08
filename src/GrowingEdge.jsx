import { useEffect, useRef } from "react";

const GrowingEdge = ({ id, sourceX, sourceY, targetX, targetY }) => {
  const edgeRef = useRef(null);

  useEffect(() => {
    const pathElement = edgeRef.current;
    const pathLength = pathElement.getTotalLength();

    pathElement.style.strokeDasharray = pathLength;
    pathElement.style.strokeDashoffset = pathLength;

    const animation = pathElement.animate(
      [{ strokeDashoffset: pathLength }, { strokeDashoffset: 0 }],
      {
        duration: 500, // Animation duration in ms
        easing: "ease-out",
        fill: "forwards",
      }
    );

    return () => animation.cancel(); // Clean up animation on unmount
  }, [sourceX, sourceY, targetX, targetY]);

  const edgePath = `M${sourceX},${sourceY} C${sourceX},${
    (sourceY + targetY) / 2
  } ${targetX},${(sourceY + targetY) / 2} ${targetX},${targetY}`;

  return (
    <g>
      <path
        ref={edgeRef}
        d={edgePath}
        style={{
          stroke: "black",
          strokeWidth: 2,
          fill: "none",
        }}
      />
    </g>
  );
};

export default GrowingEdge;
