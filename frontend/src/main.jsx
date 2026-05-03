import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// WHY no StrictMode? / TẠI SAO không dùng StrictMode?
// StrictMode intentionally runs effects TWICE in dev to catch bugs.
// This causes Three.js WebGL to initialise → dispose → re-initialise,
// which fills the console with deprecation warnings every page load.
// StrictMode cố ý chạy effects HAI LẦN trong dev để phát hiện bug.
// Điều này khiến Three.js WebGL khởi tạo → dispose → khởi tạo lại,
// làm đầy console với cảnh báo mỗi lần tải trang.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
