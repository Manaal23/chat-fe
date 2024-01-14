import React, { EffectCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
// eslint-disable-next-line import/no-cycle
import { debounce } from 'lodash';
// eslint-disable-next-line import/no-cycle
import UserList from './userList';
import InputField from '../../atoms/Input/Input';
import socket from '../../socket';
import useAxiosFetch from '../../common/useApiCall';
import { EndPoints } from '../../constants/endpoints';
import {
  setBlockDetails,
  setSelectedUser,
  setUsersList,
} from '../../store/slices/authSlice';
import PrivateRoute from '../../common/privateRoutes';

type CustomProps = {
  isVisible?: boolean;
};

interface IMsgArr {
  messageText: string;
  key_from_me?: number;
  isRead?: number;
}
export interface ISocketUser {
  length: any;
  userID: number;
  connected: boolean;
  messages: IMsgArr[];
}

function UserDashboard() {
  const [updateMsg, setUpdateMsg] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [isOpenChat, setIsOpenChat] = useState<boolean>(false);
  const [userListType, setUserListType] = useState<string>('filter');
  const state1 = useSelector((state: any) => state);
  const { selectedUser } = useSelector((state: any) => state.auth);
  const { blockDetails } = useSelector((state: any) => state.auth);
  const [blockStatus, setBlockStatus] = useState('');
  const [socketUserArr, setSocketUserArr] = useState<ISocketUser[]>([]);
  const { authUser } = useSelector((state: any) => state.auth);
  const [msg, setMsg] = useState<IMsgArr[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [receiverKey, setReceiverKey] = useState<number>(null);
  const [unreadCountObj, setUnreadCountObj] = useState<Object>({});
  const { usersList } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const scrollEndRef = useRef(null);
  const [data, error, loading, fetchData] = useAxiosFetch();

  const dispatch = useDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUpdateMsg(e.target.value);
  };

  const handlePrivateMsg = (
    msgData: {
      from: string | number;
      updateMsg: any;
    },
    callback
  ) => {
    if (selectedUser.userId && selectedUser.userId === msgData.from) {
      callback(true);
    } else {
      callback(false);
    }

    const unreadMsg = JSON.parse(localStorage.getItem('unreadMsg')) ?? {};

    unreadMsg[msgData.from] = unreadMsg[msgData.from]
      ? unreadMsg[msgData.from] + 1
      : 1;
    const unreadMsgStr = unreadMsg ? JSON.stringify(unreadMsg) : null;

    if (msgData?.from === selectedUser?.userId) {
      setMsg([
        ...msg,
        {
          messageText: msgData.updateMsg,
          key_from_me: receiverKey === 1 ? 0 : 1,
        },
      ]);
    } else {
      localStorage.setItem('unreadMsg', unreadMsgStr);
      setUnreadCountObj(unreadMsg);
    }
  };

  const getMouseMove = () => {
    let timeout;
    document.onmousemove = function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.clear();
        router.push('/');
      }, 600000);
    };
  };

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    // getMouseMove(); //uncc
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    socket.on('private-message', handlePrivateMsg);
    socket.on('msg-seen', handleIsSeen);

    return () => {
      socket.off('private-message');
      socket.off('msg-seen');
      // socket.disconnect();
    };
  }, [selectedUser, msg]);

  useEffect(() => {
    scrollToBottom();
  }, [msg]);

  const handleIsSeen = ({ ...data2 }) => {
    // When user sees unread messages blue tick all msg.
    const tempMsg = [...msg];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tempMsg.length; i++) {
      tempMsg[i].isRead = 1;
    }
    setMsg([...tempMsg]);
    console.log(data2, '*****************handleIsSeen');
  };

  const scrollToBottom = () => {
    const chatBox = scrollEndRef.current;
    if (chatBox) {
      const isScrolledToBottom =
        chatBox.scrollHeight - chatBox.scrollTop === chatBox.clientHeight;
      if (!isScrolledToBottom) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
  };

  const saveMessage = async (chatMsg) => {
    await fetchData({
      method: 'POST',
      url: EndPoints.chat.SAVE_CHAT,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        ...chatMsg,
      },
    });
  };
  const handleEnterMsg = (e: any) => {
    if (e.key === 'Enter') {
      saveMessage({
        messageText: updateMsg,
        receiverId: selectedUser.userId,
      });

      const data1 = { updateMsg, to: selectedUser.userId };
      socket.emit('private-message', data1, (isSeen) => {
        console.log(isSeen, '(**************isSeen');
        setMsg([
          ...msg,
          {
            messageText: updateMsg,
            key_from_me: receiverKey,
            isRead: isSeen[0] ? 1 : 0,
          },
        ]);
      });
      setUpdateMsg('');
    }
  };

  const handleSubmit = (e: any) => {
    console.log(selectedUser, 'slected');
    saveMessage({
      messageText: updateMsg,
      receiverId: selectedUser.userId,
    });

    const data1 = { updateMsg, to: selectedUser.userId };
    setMsg([...msg, { messageText: updateMsg, key_from_me: receiverKey }]);
    socket.emit('private-message', data1, (isSeen) => {
      console.log(isSeen, '(**************isSeen');
    });

    setUpdateMsg('');

    // --------------------------------------

    // console.log(authUser, '----------authUser');
    // const data = { updateMsg, to: selectedUser.userId };
    // // console.log('called!!', data);
    // socket.emit('private-message', data);

    // const tempSocketArr = [...socketUserArr];
    // const userMsg = tempSocketArr?.filter(
    //   (itm) => itm.userID === selectedUser.userId
    // )[0];

    // userMsg.messages = [...userMsg.messages, { ...data }];
    // saveMessage();
    // setSocketUserArr(tempSocketArr);
    // setMsg(userMsg.messages);
  };

  const debouncedSearch = React.useRef(
    debounce(async (criteria: string) => {
      await fetchData(
        {
          method: 'GET',
          url: EndPoints.user.search + `?value=${criteria}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
        setUsersList
      );
    }, 500)
  ).current;

  const fetchBlockStatus = async (_val: any) => {
    const userId = _val?.userId || selectedUser.userId;
    await fetchData(
      {
        method: 'GET',
        url: EndPoints.user.CHECK_BLOCKED + `?blockId=${userId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
      setBlockDetails
    );
  };

  const getChats = async (usrData: any) => {
    const resultData = (await fetchData({
      method: 'GET',
      url:
        EndPoints.chat.SAVE_CHAT +
        `?page=${page}&limit=${limit}&to=${usrData?.userId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })) as any;

    setReceiverKey(resultData?.receiverKey);

    // eslint-disable-next-line no-unsafe-optional-chaining
    console.log(resultData, '************data');
    setMsg([...resultData?.result.reverse()]);
  };

  const handleBlockOption = async () => {
    setOpenOptions((prev) => !prev);
    if (!blockDetails?.isblock) {
      await fetchData({
        method: 'POST',
        url: EndPoints.user.BLOCK + `?blockId=${selectedUser.userId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } else {
      await fetchData({
        method: 'POST',
        url: EndPoints.user.UNBLOCK + `?unblockId=${selectedUser.userId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    }
    await fetchBlockStatus({});
  };

  const getNotificationsCount = () => {
    const ls = JSON.parse(localStorage.getItem('unreadMsg')) ?? null;
    let count = 0;
    if (ls) {
      // eslint-disable-next-line array-callback-return
      Object.values(ls).map((i: number) => {
        count += i;
      });
    }
    return count;
  };

  return (
    // <PrivateRoute>
    <DashboardContainer>
      <DashboardWrapper>
        <SearchBox isVisible={isOpenChat}>
          <InputField
            name="userSearch"
            placeholder="Search to chat"
            onChange={(e) => {
              setUserListType('search');
              setSearchText(e.target.value);
              debouncedSearch(e.target.value);
            }}
            value={searchText}
            inputStyles={{
              borderRadius: '40px',
              marginBottom: '0px',
              paddingLeft: '24px',
              backgroundColor: 'white',
              border: 'none',
              width: '40%',
            }}
          />
        </SearchBox>
        <DashboardChatBox>
          <ListWrapper isVisible={!isOpenChat}>
            <UserTabs>
              <History onClick={() => setUserListType('filter')}>
                <i className="fa fa-home fa-lg" aria-hidden="true" />
                <span>Users</span>
              </History>
              <History onClick={() => setUserListType('contact')}>
                {getNotificationsCount() ? (
                  <span className="notification">
                    {getNotificationsCount()}
                  </span>
                ) : null}
                <i className="fa fa-list fa-lg" />
                <span>History</span>
              </History>
            </UserTabs>
            <UserList
              fetchBlockStatus={fetchBlockStatus}
              getChats={getChats}
              userListType={userListType}
              setIsOpenChat={setIsOpenChat}
              socketUserArr={socketUserArr}
              setSocketUserArr={setSocketUserArr}
              unreadCountObj={unreadCountObj}
              setUnreadCountObj={setUnreadCountObj}
            />
          </ListWrapper>
          {/* {Object.keys(selectedUser)?.length ? ( */}
          <UserChatBoxConatainer isVisible={isOpenChat}>
            <BackButton
              onClick={() => {
                setIsOpenChat(false);
                dispatch(setSelectedUser({}));
              }}
            >
              &lt;users
            </BackButton>
            <UserChatBox>
              <UserDetail>
                <Details>
                  <MsgImage
                    className="left-img"
                    // style="background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)"
                  />
                  <Name>{selectedUser?.name}</Name>
                </Details>
                <Report onClick={() => setOpenOptions(!openOptions)}>
                  <i
                    className="fa fa-ellipsis-v"
                    style={{
                      fontSize: '22px',
                      cursor: 'pointer',
                    }}
                  />
                </Report>
                {openOptions && (
                  <Options>
                    <span
                      onClick={handleBlockOption}
                      style={{
                        color: blockDetails?.isblock ? 'green' : 'red',
                      }}
                    >
                      {blockDetails?.isblock ? 'unblock' : 'block'}
                    </span>
                  </Options>
                )}
              </UserDetail>
              <ChatBox ref={scrollEndRef}>
                {msg?.length
                  ? msg.map((msgItm, index) => (
                      <Message
                        className={
                          msgItm.key_from_me !== receiverKey
                            ? 'left-msg'
                            : 'right-msg'
                        }
                      >
                        {/* <MsgImage
                            className={
                              msgItm.key_from_me !== receiverKey
                                ? 'left-msg'
                                : 'right-msg'
                            }
                            // style="background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)"
                          /> */}
                        <MsgBubbleDiv>
                          <MsgBubble className="msg-bubble">
                            {/* <MsgInfo> */}
                            {/* <Name> */}
                            {/* {usersList.filter(
                                  (i) => i.userId === msgItm.from
                                )?.[0]?.name ?? 'You'} */}
                            {/* {msgItm.key_from_me !== receiverKey
                                ? selectedUser?.name
                                : 'You'}
                            </Name> */}
                            {/* </MsgInfo> */}
                            <MsgDiv>
                              <MsgText>{msgItm.messageText}</MsgText>
                            </MsgDiv>
                            {/* <Tick
                              style={{
                                bottom: '-26px !important',
                                left: '21px !important',
                              }}
                            >
                              <i className="fa fa-check" aria-hidden="true" />
                            </Tick> */}
                          </MsgBubble>
                          <MsgStatus
                            style={{
                              justifyContent:
                                msgItm.key_from_me === receiverKey
                                  ? 'flex-end'
                                  : 'flex-start',
                            }}
                          >
                            <Time>12:45</Time>
                            {msgItm.key_from_me === receiverKey ? (
                              <Tick
                                style={
                                  msgItm.isRead ? { color: '#008fe9' } : {}
                                }
                              >
                                <i className="fa fa-check" aria-hidden="true" />
                              </Tick>
                            ) : null}
                          </MsgStatus>
                        </MsgBubbleDiv>
                      </Message>
                    ))
                  : null}
              </ChatBox>
              <InputField
                onChange={handleChange}
                value={updateMsg}
                name="msg"
                placeholder="Type a message"
                hasMsgIcon
                onKeyPress={handleEnterMsg}
                handleMsg={handleSubmit}
                inputStyles={{
                  borderRadius: '40px',
                  marginBottom: '0px',
                  paddingLeft: '24px',
                  backgroundColor: 'whitesmoke',
                  border: 'none',
                }}
              />
            </UserChatBox>
          </UserChatBoxConatainer>
          {/* ) : null} */}
        </DashboardChatBox>
      </DashboardWrapper>
    </DashboardContainer>
    // </PrivateRoute>
  );
}

export default UserDashboard;

const DashboardContainer = styled.div`
  background-color: whitesmoke;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Sans', sans-serif;
  height: 100vh;
  min-height: 100vh;
  margin-top: 80px;
`;
const DashboardChatBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 80%;
  justify-content: space-between;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 100%;
  }
`;
const DashboardWrapper = styled.div`
  width: 70%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  padding: 12px;
  margin: 50px;
  margin-top: 30px;
  height: 85%;
  @media screen and (max-width: 640px) {
    margin: 0px;
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 0;
    padding: 0;
    width: 90%;
    height: 90%;
  }
`;

const ListWrapper = styled.div<CustomProps>`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-direction: column;
  position: relative;
  width: 40%;
  height: 100%;
  @media screen and (max-width: 640px) {
    width: 100%;
    height: 95%;
    display: ${({ isVisible }) => (isVisible ? 'normal' : 'none')};
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    height: 95%;
    display: ${({ isVisible }) => (isVisible ? 'normal' : 'none')};
  }
`;
const UserChatBoxConatainer = styled.div<CustomProps>`
  display: flex;
  width: 55%;
  // align-items: flex-end;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  @media screen and (max-width: 640px) {
    display: ${({ isVisible }) => (!isVisible ? 'none' : 'normal')};
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ isVisible }) => (!isVisible ? 'none' : 'normal')};
    width: 100%;
    height: 90%;
  }
`;
const UserChatBox = styled.div`
  padding: 12px;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: flex-end;
  flex-direction: column;
  border-radius: 24px;
`;
const UserDetail = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  border-bottom: 2px solid whitesmoke;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 24px;
  // padding-left: 24px;
`;
const ChatBox = styled.ul`
  flex: 1;
  max-height: 75%;
  overflow-y: auto;
  padding: 10px;
  width: 100%;
  margin-top: 56px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: white;
  }
  &::-webkit-scrollbar-thumb {
    background: white;
  }
  .right-msg {
    flex-direction: row-reverse;
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;
const Message = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  &:last-of-type {
    margin: 0;
  }
  .right-img {
    margin-right: 0;
    margin-left: 10px;
  }
  .left-msg {
    .msg-bubble {
      border-bottom-left-radius: 0;
    }
  }
  .right-msg {
    .msg-bubble {
      color: #fff;
      border-bottom-right-radius: 0;
    }
  }
`;
const MsgImage = styled.div`
  width: 45px;
  height: 45px;
  margin-right: 10px;
  background: #ddd;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
  .left-img {
    margin-right: 0;
    margin-left: 10px;
  }
`;
const MsgBubble = styled.div`
  margin-bottom: 8px;
  // width: 80%;
  position: relative;
  max-width: 350px;
  padding: 10px 20px;
  border-radius: 15px;
  background-color: whitesmoke;
`;

const MsgBubbleDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
const MsgStatus = styled.div`
  display: flex;
`;
const Tick = styled.span`
  color: gray;
  i {
    font-weight: lighter;
    font-size: 14px;
  }
`;
const MsgInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;
const Name = styled.span`
  margin-right: 10px;
  font-size: 15px;
  font-weight: bold;
`;
const Time = styled.span`
  font-size: 11px;
  color: gray;
  margin-right: 5px;
`;

const MsgDiv = styled.div`
  word-break: break-word;
`;
const MsgText = styled.span`
  font-size: 14px;
`;

const BackButton = styled.span`
  font-size: 16px;
  width: fit-content;
  border-radius: 8px;
  padding: 8px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border: 2px solid whitesmoke;
  background-color: white;
  display: none;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: inline-block !important;
  }
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Report = styled.span``;

const Options = styled.div`
  background-color: white;
  position: absolute;
  top: 50px;
  right: 20px;
  width: 120px;
  padding: 16px;
  display: flex;
  // align-items: center;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  z-index: 10;
  span {
    // margin-bottom: 4px;
    font-size: 16px;
    cursor: pointer;
  }
`;
const UserTabs = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 2px solid whitesmoke;
  padding: 16px;
  z-index: 1;
  background-color: white;
  border-radius: 24px 24px 0px 0px;
  // box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    // padding: 1px;
  }
`;
const History = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-direction: column;
  color: #475965;
  margin-top: 2px;
  span {
    display: inline-block;
    font-weight: 500;
    font-size: 12px;
  }
`;
const SearchBox = styled.div<CustomProps>`
  width: 100%;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ isVisible }) => (isVisible ? 'none' : 'inline-block')};
  }
`;
const EmptyChat = styled.div`
  width: 100%;
`;
