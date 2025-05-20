import { Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import SearchPetitions from './pages/SearchPetitions';
import Create from './pages/Create';
import Login from './pages/Login';
import User from './pages/User';
import Home from './pages/Home';
import Petition from './pages/Petition';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import SearchUsers from './pages/SearchUsers';
import Edit from './pages/Edit';

function App() {
  return (
    <div className={styles.App}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<Create />} />
        <Route path='/edit/:id' element={<Edit />} />
        <Route path='/petitions' element={<SearchPetitions />} />
        <Route path='/petition/:id' element={<Petition />} />
        <Route path='/users' element={<SearchUsers />} />
        <Route path='/user/:id' element={<User />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
