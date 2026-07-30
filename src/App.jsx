import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// بنستخدم HashRouter (مش BrowserRouter) عشان الموقع يشتغل صح تحت أي مسار
// فرعي (زي GitHub Pages: username.github.io/repo-name/) من غير أي إعدادات
// إضافية على السيرفر. الرابط هيبقى فيه # بسيط (مثلاً .../#/) وده طبيعي.
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}

export default App;