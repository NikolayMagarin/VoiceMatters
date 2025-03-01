import { Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import Browse from './pages/Browse';
import Create from './pages/Create';
import Login from './pages/Login';
import My from './pages/My';
import News from './pages/News';
import Promo from './pages/Promo';
import Register from './pages/Register';
// import Header from './components/Header';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className={styles.App}>
      <div>
        <Routes>
          <Route path='/' element={<News />}></Route>
          <Route path='/browse' element={<Browse />}></Route>
          <Route path='/create' element={<Create />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/my' element={<My />}></Route>
          <Route path='/view/:id' element={<Promo />}></Route>

          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
