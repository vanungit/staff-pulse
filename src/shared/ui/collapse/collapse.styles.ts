import styled from "styled-components";

export const Track = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? "1fr" : "0fr")};
  transition: grid-template-rows 220ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Clip = styled.div`
  overflow: hidden;
  min-height: 0;
`;
