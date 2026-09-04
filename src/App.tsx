import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ChiSiamo } from "./pages/ChiSiamo";
import { Home } from "./pages/Home";
import { Libro } from "./pages/Libro";
import { NonTrovata } from "./pages/NonTrovata";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/libri/:slug" element={<Libro />} />
          <Route path="*" element={<NonTrovata />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
