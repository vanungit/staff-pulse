import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100dvh;
  overflow: hidden;
`;

export const Header = styled.header`
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.l};
  padding: 18px 28px;
  background: ${({ theme }) => theme.color.header};
  color: ${({ theme }) => theme.color.headerText};
  animation: staffHeaderIn ${({ theme }) => theme.motion.mid} ${({ theme }) => theme.motion.easeOut};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const BrandName = styled.p`
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.headerMuted};
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 650;
`;

export const HeaderAside = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

export const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.headerMuted};
  font-size: 13px;
`;

export const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 16px 28px 20px;

  @media (max-width: 640px) {
    padding: 12px 12px 16px;
  }
`;

export const Layout = styled.div<{ $isSplit: boolean }>`
  display: grid;
  flex: 1;
  min-height: 0;
  grid-template-columns: ${({ $isSplit }) => ($isSplit ? "minmax(280px, 1fr) minmax(0, 1.3fr)" : "1fr")};
  grid-template-rows: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space.l};
`;

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  padding: ${({ theme }) => theme.space.l};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.line};
  border-radius: ${({ theme }) => theme.radius.l};
  box-shadow: ${({ theme }) => theme.shadow.card};
  animation: staffEnter ${({ theme }) => theme.motion.slow} ${({ theme }) => theme.motion.easeOut} both;

  &:nth-child(2) {
    animation-delay: 70ms;
  }
  transition: box-shadow ${({ theme }) => theme.motion.mid} ${({ theme }) => theme.motion.easeOut};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.raised};
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

export const PanelTitle = styled.h2`
  flex-shrink: 0;
  margin: 0 0 ${({ theme }) => theme.space.m};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.textMuted};
`;

export const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  overflow-anchor: none;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => `${theme.color.line} transparent`};

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.line};
    border-radius: 999px;
  }
`;
