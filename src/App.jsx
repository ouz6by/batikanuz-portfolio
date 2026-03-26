import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const Home = lazy(() => import('./pages/Home'));
import LanguageSelector from './components/LanguageSelector';
import IntroScreen from './components/IntroScreen';

function App() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500 selection:text-white relative">
        {!introFinished && <IntroScreen onComplete={() => setIntroFinished(true)} />}
        <LanguageSelector />
        <Routes>
            <Route path="/" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><Home /></Suspense>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
