import Header from '../../components/Header';
import SloganBlock from './components/SloganBlock';
import styles from './Home.module.css';

import BottomBlock from './components/BottomBlock';
import Footer from '../../components/Footer';
import News from './components/News';

function Home() {
  return (
    <>
      <Header navigated='news' />
      <main>
        <SloganBlock />
        <div className={styles.head}>Последние успешные петиции</div>
        <News />
        <BottomBlock />
      </main>
      <Footer />
    </>
  );
}

export default Home;
