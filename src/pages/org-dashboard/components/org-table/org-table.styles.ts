import styled from "styled-components";

export const TableWrap = styled.div`
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: auto;
  overflow-anchor: none;
  border: 1px solid ${({ theme }) => theme.color.line};
  border-radius: ${({ theme }) => theme.radius.m};
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => `${theme.color.line} transparent`};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.accent};
    outline-offset: 2px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const Th = styled.th<{ $isActive?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  background: ${({ theme }) => theme.color.surfaceMuted};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.color.accent : theme.color.text};
  border-bottom: 1px solid ${({ theme }) => theme.color.line};
  transition: color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};

  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }
`;

export const Td = styled.td<{ $isFlashed?: boolean }>`
  padding: 9px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.color.line};
  font-variant-numeric: tabular-nums;
  animation: ${({ $isFlashed }) => ($isFlashed ? "staffPulseFade 1.5s ease-out" : "none")};
  transition: background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    box-shadow: ${({ theme, $isFlashed }) =>
      $isFlashed ? `inset 0 0 0 1px ${theme.color.accent}` : "none"};
  }
`;

export const Tr = styled.tr<{ $isSelected: boolean }>`
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.accentSoft : theme.color.surface};
  cursor: pointer;
  box-shadow: ${({ theme, $isSelected }) =>
    $isSelected ? `inset 3px 0 0 ${theme.color.accent}` : "none"};
  animation: staffRowIn ${({ theme }) => theme.motion.mid} ${({ theme }) => theme.motion.easeOut};
  transition:
    background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut},
    box-shadow ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};

  &:hover {
    background: ${({ theme, $isSelected }) =>
      $isSelected ? theme.color.accentSoft : theme.color.surfaceMuted};
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

export const SortHint = styled.span`
  display: inline-block;
  margin-left: 6px;
  font-size: 11px;
  color: ${({ theme }) => theme.color.textMuted};
  transition: transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.spring};
`;

export const EmptyFilter = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.space.l};
  color: ${({ theme }) => theme.color.textMuted};
`;
