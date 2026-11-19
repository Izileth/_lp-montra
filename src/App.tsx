import HarborEchoes from "./components/HarborEchoes";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import { useCurrentPath } from "./router";

export default function App() {
  const path = useCurrentPath();
  const isHome = path === "/" || path === "";

  return (
    <>
      {isHome ? <HarborEchoes /> : <NotFound />}
      <Footer />
    </>
  );
}
