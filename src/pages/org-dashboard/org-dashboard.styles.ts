import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
`;

export const Header = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.l};
  padding: 18px 28px;
  background: ${({ theme }) => theme.color.header};
  color: ${({ theme }) => theme.color.headerText};
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

export const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.headerMuted};
  font-size: 13px;
`;

export const Main = styled.main`
  padding: 24px 28px 40px;
`;

export const Panel = styled.section`
  max-width: 880px;
  padding: ${({ theme }) => theme.space.l};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.line};
  border-radius: ${({ theme }) => theme.radius.l};
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

export const PanelTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.space.m};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.textMuted};
`;
