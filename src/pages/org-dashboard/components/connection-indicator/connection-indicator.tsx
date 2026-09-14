import type { SocketStatus } from "../../org-dashboard.constants";

import { Dot, Label, Wrap } from "./connection-indicator.styles";

const STATUS_LABEL: Record<SocketStatus, string> = {
  connecting: "Подключение…",
  online: "Онлайн",
  reconnecting: "Переподключение…",
  offline: "Офлайн",
};

type ConnectionIndicatorProps = {
  status: SocketStatus;
};

const ConnectionIndicator = ({ status }: ConnectionIndicatorProps) => {
  return (
    <Wrap role="status" aria-live="polite">
      <Dot $status={status} />
      <Label>{STATUS_LABEL[status]}</Label>
    </Wrap>
  );
};

export { ConnectionIndicator };
