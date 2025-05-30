import Header from '../../components/Header';
import SloganBlock from './components/SloganBlock';

import BottomBlock from './components/BottomBlock';
import Footer from '../../components/Footer';
import News from './components/News';

function Home() {
  return (
    <>
      <Header navigated='news' />
      <main>
        <SloganBlock />
        <News />
        <BottomBlock />
      </main>
      <Footer />
    </>
  );
}

export default Home;
