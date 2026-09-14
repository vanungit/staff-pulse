import styled from "styled-components";

export const TableWrap = styled.div`
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.color.line};
  border-radius: ${({ theme }) => theme.radius.m};

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
`;

export const Td = styled.td<{ $isFlashed?: boolean }>`
  padding: 9px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.color.line};
  font-variant-numeric: tabular-nums;
  animation: ${({ $isFlashed }) => ($isFlashed ? "staffPulseFade 1.5s ease-out" : "none")};

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

  &:hover {
    background: ${({ theme, $isSelected }) =>
      $isSelected ? theme.color.accentSoft : theme.color.surfaceMuted};
  }
`;

export const SortHint = styled.span`
  margin-left: 6px;
  font-size: 11px;
  color: ${({ theme }) => theme.color.textMuted};
`;

export const EmptyFilter = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.space.l};
  color: ${({ theme }) => theme.color.textMuted};
`;
