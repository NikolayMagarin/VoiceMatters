import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { apiPath } from '../../../../lib/api/apiPath';
import { GetPetitionUsersResponse } from '../../../../lib/api/types';
import { imageUrl } from '../../../../utils/imageUrl';
import styles from './UsersSigned.module.css';

interface Props {
  petitionId: string;
  signQuantity: number;
}

const USERS_PER_PAGE = 24;

function UsersSigned({ petitionId, signQuantity }: Props) {
  const [pageNumber, setPageNumber] = useState(1);

  const { data: users } = useQuery(
    ['petition-users', petitionId, pageNumber],
    ({ queryKey: [_, petitionId, pageNumber] }) => {
      return api.get<GetPetitionUsersResponse>(
        apiPath.getPetitionUsers(
          petitionId as string,
          USERS_PER_PAGE,
          pageNumber as number
        )
      );
    },
    {
      select: (response) => response.data,
      keepPreviousData: true,
    }
  );

  const lastPageNumber = useMemo(
    () => Math.floor((signQuantity - 1) / USERS_PER_PAGE) + 1,
    [signQuantity]
  );

  return (
    <div>
      Петицию подписали:
      {users && (
        <>
          <div className={styles.container}>
            {users.map((user, i) => (
              <Link
                key={i}
                to={`/user/${user.id}`}
                className={styles['user-wrapper']}
              >
                <img
                  src={
                    user.imageUuid
                      ? imageUrl(user.imageUuid)
                      : '/assets/images/user-icon.svg'
                  }
                  alt=''
                />
                <div className={styles['user-name']}>
                  {`${user.firstName} ${user.lastName}`}
                </div>
              </Link>
            ))}
          </div>
          {lastPageNumber > 1 && (
            <div className={styles['btns-wrapper']}>
              <button
                onClick={() => {
                  setPageNumber(pageNumber - 1);
                }}
                disabled={pageNumber === 1}
              >
                Предыдущая
              </button>
              {pageNumber} / {lastPageNumber}
              <button
                onClick={() => {
                  setPageNumber(pageNumber + 1);
                }}
                disabled={pageNumber === lastPageNumber}
              >
                Следующая
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UsersSigned;
