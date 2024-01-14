import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Socket } from 'socket.io-client';
import { TailSpin } from 'react-loader-spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import useAxiosFetch from '../../common/useApiCall';
import { EndPoints } from '../../constants/endpoints';
import { setSelectedUser, setUsersList } from '../../store/slices/authSlice';
import socket from '../../socket';
// eslint-disable-next-line import/no-cycle
import { ISocketUser } from '.';
import { LoadingText } from '../../utils/constants';

interface DefaultEventsMap {
  [event: string]: (...args: any[]) => void;
}
interface ISocket extends Socket<DefaultEventsMap, DefaultEventsMap> {
  userID: string;
}

interface IPropsUserList {
  setIsOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
  socketUserArr: ISocketUser[];
  setSocketUserArr: React.Dispatch<React.SetStateAction<ISocketUser[]>>;
  userListType: string;
  fetchBlockStatus: ({}: any) => Promise<void>;
  getChats: (args: any) => Promise<void>;
  unreadCountObj: object;
  setUnreadCountObj: (args: object) => void;
}

function UserList(props: IPropsUserList) {
  const {
    socketUserArr,
    setSocketUserArr,
    setIsOpenChat,
    userListType,
    fetchBlockStatus,
    getChats,
    unreadCountObj,
    setUnreadCountObj,
  } = props;
  const dispatch = useDispatch();
  const { usersList } = useSelector((state: any) => state.auth);
  const [data, error, loading, fetchData] = useAxiosFetch();
  const [item, setItem] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    getUserList(true);
  }, [userListType]);

  useEffect(() => {
    console.log(socketUserArr, '---------socketUserArr');
  }, [socketUserArr]);

  useEffect(() => {
    // if (userListType === 'filter') setItem([...item, ...usersList]);
    if (userListType === 'filter') setItem([...usersList]);
    else setItem(usersList);
    if (usersList?.length < 10) setHasMore(false);
    else setHasMore(true);
  }, [usersList]);

  const getUserList = async (isFirstCall = false) => {
    setDataLoading(true);
    if (!isFirstCall) {
      setPage((prevPage) => prevPage + 1);
    }
    await fetchData(
      {
        method: 'GET',
        url:
          EndPoints.user[userListType] +
          `?page=${isFirstCall ? page : page + 1}&limit=${10}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: localStorage.getItem('preferences'),
        // params: `page=${2}?limit=${10}`,
      },
      setUsersList
    );
    getUpdatedUserCount();
    setDataLoading(false);

    // if (!error) {
    //   socket.auth = { token: localStorage.getItem('token') };
    //   socket.connect();
    // }
    const sessionID = localStorage.getItem('token');
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }
  };
  socket.on('session', ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    // localStorage.setItem('sessionID', sessionID);
    // save the ID of the user
    (socket as ISocket).userID = userID;
  });

  socket.on('connect_error', (err) => {
    if (err.message) {
      console.error('Socket connection failed');
    }
  });

  socket.on('users', (users) => {
    setSocketUserArr(users);
  });

  socket.on('user connected', (userInfo) => {
    console.log('user connected', userInfo);
    // setSocketUserArr(userInfo.users);
    // const tempUsers = [...usersList];
  });

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  const getUpdatedUserCount = (_val?) => {
    console.log(_val, '-----------_val');
    const getUnreadMsg = localStorage.getItem('unreadMsg');
    let tempObj;
    if (getUnreadMsg) {
      tempObj = JSON.parse(getUnreadMsg);
      if (_val) delete tempObj[_val.userId];
      setUnreadCountObj(tempObj);
      localStorage.setItem('unreadMsg', JSON.stringify(tempObj));
    }
  };

  const handlePrivateChat = (_val) => {
    getUpdatedUserCount(_val);
    dispatch(setSelectedUser(_val));
  };
  return (
    <ListContainer>
      <ListWrapper id="infinite-scroll">
        {/* {loading && !dataLoading ? (
          <LoaderWrapper>
            <TailSpin
              height="70"
              width="70"
              color="gray"
              ariaLabel="tail-spin-loading"
              radius="1"
              visible
            />
          </LoaderWrapper>
        ) : ( */}
        <InfiniteScroll
          dataLength={item?.length}
          // height={450}
          next={getUserList}
          hasMore={hasMore}
          loader={
            <LoaderWrapper>
              <TailSpin
                height="50"
                width="50"
                color="gray"
                ariaLabel="tail-spin-loading"
                radius="1"
                visible
              />
            </LoaderWrapper>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>
                {console.log(userListType, '************8')}
                {item.length
                  ? LoadingText[userListType].END
                  : dataLoading
                  ? LoadingText[userListType].Loading
                  : LoadingText[userListType].EMPTY}
              </b>
            </p>
          }
          scrollableTarget="infinite-scroll"
        >
          {item?.map((_val) => (
            <ChatPreview
              key={_val?.userId || _val?.id}
              onClick={() => {
                handlePrivateChat(_val);
                setIsOpenChat(true);
                fetchBlockStatus(_val);
                getChats(_val);
              }}
            >
              <ProfileBox>
                <Avatar>
                  <ProfileImg
                    src="/femaleAvatar.svg"
                    height={36}
                    width={36}
                    alt="female"
                  />
                </Avatar>
              </ProfileBox>
              <UserDetails>
                <UpperBox>
                  <UserName>{_val?.name}</UserName>
                  <NotifiyDetails>09:00</NotifiyDetails>
                  {unreadCountObj &&
                  unreadCountObj[_val.userId] &&
                  userListType === 'contact' ? (
                    <span>{unreadCountObj && unreadCountObj[_val.userId]}</span>
                  ) : null}
                </UpperBox>
                <LowerBox>
                  <LastMsg>Hi, how are you?</LastMsg>
                </LowerBox>
              </UserDetails>
            </ChatPreview>
          ))}
        </InfiniteScroll>
        {/* )} */}
      </ListWrapper>
    </ListContainer>
  );
}

export default UserList;

const ListContainer = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 0px 0px 24px 24px;
  height: 100%;
  max-height: 90%;
  margin-top: 50px;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: 60px;
  }
`;
const ListWrapper = styled.div`
  padding-top: 24px;
  // border-radius: 24px;
  width: 100%;
  height: 95%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #6969dd #e0e0e0;
  scrollbar-gutter: stable;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb {
  }
`;
const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatPreview = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 12px;
  cursor: pointer;
`;
const ProfileBox = styled.div`
  padding: 0 15px 0 13px;
  display: flex;
  padding-bottom: 20px;
`;
const Avatar = styled.span`
  display: flex;
  align-items: center;
  background-color: orange;
  padding: 9px;
  border-radius: 50%;
`;
const ProfileImg = styled(Image)``;
const UserDetails = styled.div`
  margin-left: 12px;
  width: 90%;
  display: flex;
  // align-items: center;
  justify-content: center;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ambienceGrey[13]};
`;
const UpperBox = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  span {
    position: absolute;
    right: 10px;
    top: 30px;
    background-color: #008fe9;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 11px;
    color: white;
  }
`;
const LowerBox = styled.span`
  font-size: 13px;
`;
const LastMsg = styled.span``;
const UserName = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 17px;
`;
const NotifiyDetails = styled.div`
  font-size: 12px;
`;
