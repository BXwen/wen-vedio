import React from "react";
import { HITS110 } from "./timeline110";
import { enter } from "../lib/motion";
import { Seal } from "../components/Seal";

/** The only final seal; it sits beside the closing line. */
export const Finale110: React.FC<{ frame: number }> = ({ frame }) => {
  const seal = enter(frame, HITS110.seal, 6);

  return (
    <div
      style={{
        position: "absolute",
        left: 1272,
        top: 405,
        opacity: seal,
      }}
    >
      <Seal text="祖率" size={130} at={HITS110.seal} duration={10} />
    </div>
  );
};
