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
    height: 100%;
    overflow: hidden;
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
    0% {
      background-color: ${({ theme }) => theme.color.accentSoft};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.color.accent};
    }

    100% {
      background-color: transparent;
      box-shadow: inset 0 0 0 1px transparent;
    }
  }

  @keyframes staffEnter {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes staffHeaderIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes staffSelectPulse {
    0% {
      box-shadow: inset 3px 0 0 ${({ theme }) => theme.color.accent};
    }

    50% {
      box-shadow: inset 5px 0 0 ${({ theme }) => theme.color.accent};
    }

    100% {
      box-shadow: inset 3px 0 0 ${({ theme }) => theme.color.accent};
    }
  }

  @keyframes staffOnlinePulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.35);
      opacity: 0.7;
    }
  }

  @keyframes staffRowIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }
`;
