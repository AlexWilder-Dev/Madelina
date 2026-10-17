import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { BranchProvider, useBranch } from './lib/branch';
import { FloatingBook, Footer, Header } from './components/Frame';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Book } from './pages/Book';

/** /brixton and /dulwich: shareable links that pick the branch, then land on the home page. */
function PickBranch() {
  const { id } = useParams();
  const { setBranch } = useBranch();
  const valid = id === 'brixton' || id === 'dulwich';
  useEffect(() => {
    if (valid) setBranch(id);
  }, [id, valid, setBranch]);
  return <Navigate to="/" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Routed() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/book" element={<Book />} />
          <Route path="/:id" element={<PickBranch />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <BranchProvider>
          <ScrollToTop />
          <Header />
          <Routed />
          <Footer />
          <FloatingBook />
        </BranchProvider>
      </HashRouter>
    </MotionConfig>
  );
}
