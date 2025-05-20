import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { api, apiPath } from '../../../../lib/api';
import { SearchNewsResponse } from '../../../../lib/api/types';
import { imageUrl } from '../../../../utils/imageUrl';
import { plural } from '../../../../utils/plural';
import styles from './News.module.css';

function News() {
  const { data: news } = useQuery(
    ['news-home'],
    () =>
      api.get<SearchNewsResponse>(
        apiPath.searchNews({
          title: '',
          sort: {
            type: 'date',
            descending: true,
          },
          pageNumber: 1,
          pageSize: 5,
        })
      ),
    {
      select: ({ data }) => data,
    }
  );

  return (
    <>
      {news && news.length > 0 && (
        <>
          <hr className={styles.line} />
          {news.map((news, i) => {
            const img = news.petitionImages.length
              ? imageUrl(
                  news.petitionImages.sort((a, b) => a.order - b.order)[0].uuid
                )
              : null;

            return (
              <div key={i}>
                <div
                  className={
                    styles.wrapper + (i % 2 === 1 ? ` ${styles.reverse}` : '')
                  }
                >
                  <div className={styles['left-part']}>
                    <div className={styles.name}>{news.title}</div>
                    <div>
                      <div className={styles.signs}>
                        Петиция набрала {news.signQuantity}{' '}
                        {plural(
                          news.signQuantity,
                          'подпись',
                          'подписи',
                          'подписей'
                        )}
                      </div>
                      <Link
                        to={'/petition/' + news.petitionId}
                        className={styles['link']}
                      >
                        Перейти к петиции
                      </Link>
                    </div>
                  </div>
                  <div className={styles['right-part']}>
                    <img
                      className={styles.image}
                      src={img || '/assets/images/image-placeholder.png'}
                      alt=''
                      style={!img ? { objectFit: 'contain' } : {}}
                    />
                  </div>
                </div>
                <hr className={styles.line} />
              </div>
            );
          })}
        </>
      )}
    </>
  );
}

export default News;
