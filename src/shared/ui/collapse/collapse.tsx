import type { ReactNode } from "react";

import { Clip, Track } from "./collapse.styles";

type CollapseProps = {
  isOpen: boolean;
  children: ReactNode;
};

const Collapse = ({ isOpen, children }: CollapseProps) => {
  return (
    <Track $isOpen={isOpen}>
      <Clip>{children}</Clip>
    </Track>
  );
};

export { Collapse };
