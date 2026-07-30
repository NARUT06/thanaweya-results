import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// الموقع دلوقتي صفحة واحدة بس، لكن سايبينه فوق React Router عشان
// لو حبيت تضيف صفحات تانية بعدين (زي صفحة تفاصيل طالب /student/:id)
// يبقى سهل تضيفها هنا من غير ما تغيّر أي حاجة في الصفحة الحالية.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
