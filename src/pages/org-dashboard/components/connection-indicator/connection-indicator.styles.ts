import styled from "styled-components";

import type { SocketStatus } from "../../org-dashboard.constants";

const STATUS_COLOR: Record<SocketStatus, "success" | "warning" | "textMuted"> = {
  connecting: "warning",
  online: "success",
  reconnecting: "warning",
  offline: "textMuted",
};

export const Wrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.color.headerMuted};
  font-size: 13px;
`;

export const Dot = styled.span<{ $status: SocketStatus }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $status }) => theme.color[STATUS_COLOR[$status]]};
  animation: ${({ $status }) =>
    $status === "online" ? "staffOnlinePulse 1.8s ease-in-out infinite" : "none"};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Label = styled.span``;
