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

export const NodeRow = styled.div<{ $isSelected?: boolean; $isFlashed?: boolean }>`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: ${({ theme }) => theme.space.s};
  min-height: 36px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.s};
  cursor: pointer;
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.accentSoft : "transparent"};
  box-shadow: ${({ theme, $isSelected }) =>
    $isSelected ? `inset 3px 0 0 ${theme.color.accent}` : "none"};
  animation: ${({ $isFlashed, $isSelected }) => {
    if ($isFlashed) {
      return "staffPulseFade 1.5s ease-out";
    }

    if ($isSelected) {
      return "staffSelectPulse 520ms ease-out";
    }

    return "none";
  }};
  transition:
    background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut},
    transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut},
    box-shadow ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};

  &:hover {
    background: ${({ theme, $isSelected }) =>
      $isSelected ? theme.color.accentSoft : theme.color.surfaceMuted};
    transform: translateX(3px);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
    transform: none;
    box-shadow: ${({ theme, $isFlashed, $isSelected }) =>
      $isFlashed || $isSelected ? `inset 3px 0 0 ${theme.color.accent}` : "none"};
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
  transition:
    background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut},
    color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};

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
  transition: transform ${({ theme }) => theme.motion.mid} ${({ theme }) => theme.motion.spring};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const NodeName = styled.span`
  flex: 1;
  min-width: 0;
  font-weight: 550;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Headcount = styled.span`
  flex-shrink: 0;
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
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  min-width: 54px;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  transition: transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.spring};
  ${({ $tone }) => toneStyles[$tone]}

  ${NodeRow}:hover & {
    transform: scale(1.06);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const PerformanceDot = styled.span<{ $tone: "low" | "mid" | "high" }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
`;
