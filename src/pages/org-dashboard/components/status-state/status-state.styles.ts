import styled from "styled-components";

type Kind = "loading" | "error" | "empty";

export const StatusCard = styled.section<{ $kind: Kind }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.s};
  padding: ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radius.l};
  background: ${({ theme }) => theme.color.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};
  border: 1px solid ${({ theme }) => theme.color.line};
  border-left-width: 4px;
  border-left-color: ${({ theme, $kind }) => {
    if ($kind === "error") {
      return theme.color.danger;
    }

    if ($kind === "empty") {
      return theme.color.warning;
    }

    return theme.color.accent;
  }};
`;

export const StatusTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

export const StatusText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.textMuted};
  line-height: 1.5;
`;

export const RetryButton = styled.button`
  align-self: flex-start;
  margin-top: ${({ theme }) => theme.space.s};
  padding: 8px 14px;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.s};
  background: ${({ theme }) => theme.color.accent};
  color: ${({ theme }) => theme.color.surface};
  cursor: pointer;
`;
