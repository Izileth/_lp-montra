import HarborEchoes from "./components/HarborEchoes";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import { useCurrentPath } from "./router";
import Navbar from "./components/Navbar";
export default function App() {
  const path = useCurrentPath();
  const isHome = path === "/" || path === "";

  return (
    <>
      <Navbar />
      {
        isHome ?  <HarborEchoes /> : <NotFound />
      }
      <Footer />
    </>
  );
}
