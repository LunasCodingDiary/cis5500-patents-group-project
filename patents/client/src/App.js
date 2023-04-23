import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { indigo, amber } from '@mui/material/colors';
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PatentsPage from './pages/PatentsPage';
import PatentMapPage from './pages/PatentMapPage';
import PatentVizPage from './pages/PatentVizPage';
import SearchPatentPage from './pages/SearchPatentPage';

export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patents" element={<PatentsPage />} />
          <Route path="/patent/:id" element={<PatentVizPage />} />
          <Route path="/patent_map_filter" element={<PatentMapPage />} />
          <Route path="/search_patents" element={<SearchPatentPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}