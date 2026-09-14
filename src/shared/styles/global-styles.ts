import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.font.family};
    color: ${({ theme }) => theme.color.text};
    background: ${({ theme }) => theme.color.bg};
    -webkit-font-smoothing: antialiased;
  }

  button,
  input {
    font: inherit;
  }

  @keyframes staffPulseFade {
    from {
      background-color: ${({ theme }) => theme.color.accentSoft};
    }

    to {
      background-color: transparent;
    }
  }
`;
