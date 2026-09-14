import { ThemeProvider } from "styled-components";

import { OrgDashboard } from "@/pages/org-dashboard/org-dashboard";
import { GlobalStyles } from "@/shared/styles/global-styles";
import { theme } from "@/shared/styles/theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <OrgDashboard />
    </ThemeProvider>
  );
};

export { App };
