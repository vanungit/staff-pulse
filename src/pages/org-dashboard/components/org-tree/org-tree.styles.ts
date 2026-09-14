import styled, { css } from "styled-components";

export const TreeList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NestedList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 18px;
  border-left: 1px dashed ${({ theme }) => theme.color.line};
  margin-left: 13px;
`;

export const TreeItem = styled.li`
  margin: 2px 0;
`;

export const NodeRow = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.s};
  min-height: 36px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.s};
  cursor: pointer;
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.accentSoft : "transparent"};

  &:hover {
    background: ${({ theme, $isSelected }) =>
      $isSelected ? theme.color.accentSoft : theme.color.surfaceMuted};
  }
`;

export const ToggleButton = styled.button<{ $isHidden?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme.color.textMuted};
  cursor: pointer;
  visibility: ${({ $isHidden }) => ($isHidden ? "hidden" : "visible")};

  &:hover {
    background: ${({ theme }) => theme.color.line};
    color: ${({ theme }) => theme.color.text};
  }
`;

export const Chevron = styled.span<{ $isExpanded: boolean }>`
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 6px solid currentColor;
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? "90deg" : "0deg")});
`;

export const NodeName = styled.span`
  flex: 1;
  min-width: 0;
  font-weight: 550;
`;

export const Headcount = styled.span`
  color: ${({ theme }) => theme.color.textMuted};
  font-variant-numeric: tabular-nums;
  font-size: 13px;
`;

const toneStyles = {
  low: css`
    background: ${({ theme }) => theme.color.dangerSoft};
    color: ${({ theme }) => theme.color.performanceLow};
  `,
  mid: css`
    background: ${({ theme }) => theme.color.warningSoft};
    color: ${({ theme }) => theme.color.performanceMid};
  `,
  high: css`
    background: ${({ theme }) => theme.color.successSoft};
    color: ${({ theme }) => theme.color.performanceHigh};
  `,
};

export const PerformanceBadge = styled.span<{ $tone: "low" | "mid" | "high" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 54px;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  ${({ $tone }) => toneStyles[$tone]}
`;

export const PerformanceDot = styled.span<{ $tone: "low" | "mid" | "high" }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
`;
