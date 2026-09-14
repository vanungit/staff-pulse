import styled from "styled-components";

export const Toolbar = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space.m};
  margin-bottom: ${({ theme }) => theme.space.m};
  animation: staffEnter ${({ theme }) => theme.motion.mid} ${({ theme }) => theme.motion.easeOut};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const SearchField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 100%;
  min-width: 0;
  max-width: 420px;
`;

export const SearchLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.color.textMuted};
`;

export const SearchHint = styled.span<{ $mode: "structured" | "fallback" | "idle" }>`
  min-height: 16px;
  font-size: 12px;
  color: ${({ theme, $mode }) =>
    $mode === "structured" ? theme.color.accent : theme.color.textMuted};
  transition: color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.color.line};
  border-radius: ${({ theme }) => theme.radius.s};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  transition:
    border-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut},
    box-shadow ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.color.accentSoft};
  }
`;

export const ViewSwitch = styled.div`
  display: inline-flex;
  padding: 3px;
  border-radius: ${({ theme }) => theme.radius.s};
  background: ${({ theme }) => theme.color.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.color.line};
`;

export const ViewButton = styled.button<{ $isActive: boolean }>`
  padding: 6px 12px;
  border: 0;
  border-radius: 4px;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.color.surface : "transparent"};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.color.text : theme.color.textMuted};
  box-shadow: ${({ theme, $isActive }) => ($isActive ? theme.shadow.card : "none")};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut},
    color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut},
    box-shadow ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};
`;
