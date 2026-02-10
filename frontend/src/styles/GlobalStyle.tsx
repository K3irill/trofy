'use client'

import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, ${(props) => props.theme.colors.dark.bg} 0%, ${(props) => props.theme.colors.dark[800]} 50%, ${(props) => props.theme.colors.dark.bg} 100%);
    min-height: 100vh;
  }

  html,
  body {
    height: 100%;
    overflow-x: hidden;
  }

  /* Glassmorphism utility classes */
  .glass {
    background: ${(props) => props.theme.glass.bg};
    backdrop-filter: ${(props) => props.theme.glass.blur};
    -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
    border: ${(props) => props.theme.glass.border};
  }

  .glass-light {
    background: ${(props) => props.theme.glass.bgLight};
    backdrop-filter: ${(props) => props.theme.glass.blur};
    -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
    border: ${(props) => props.theme.glass.border};
  }

  /* Neomorphism utility classes */
  .neomorph {
    background: ${(props) => props.theme.neomorph.bg};
    box-shadow: ${(props) => props.theme.shadows.neomorph.light};
    border-radius: ${(props) => props.theme.neomorph.radius};
  }

  .neomorph-inset {
    background: ${(props) => props.theme.neomorph.bg};
    box-shadow: ${(props) => props.theme.shadows.neomorph.dark};
    border-radius: ${(props) => props.theme.neomorph.radiusSm};
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.dark.glass};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, ${(props) => props.theme.colors.secondary} 0%, ${(props) => props.theme.colors.primary} 100%);
  }
`
