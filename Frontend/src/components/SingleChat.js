import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/chatProvider';
import {Box,FormControl,IconButton,Input,Spinner,Text,
} from '@chakra-ui/react';
import {ArrowBackIcon, ArrowForwardIcon} from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './Additives/ProfileModal';
import UpdateGroupChatModal from './Additives/UpdateGroupChatModal';
import axios from 'axios';
import '../App.css';
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';

import io from 'socket.io-client';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ENDPOINT = 'http://localhost:6100';
var socket, selectedChatCompare;

const montdis = 'Montserrat Display';
const primaryColor = '#DAF1F4';
const secondaryColor = '#75E6DA';
const gradientColor = 'linear-gradient(to left, #75e6da, #d4f1f4 )';
const blueOne = 'linear-gradient(to left, #05445E, #189AB4 )';
const blueTwo = 'linear-gradient(to left, #05445E, #189AB4 )';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTypying] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

 const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  //for socket get initialize first,put this use effect at top
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTypying(true));
    socket.on('stop typing', () => setIsTypying(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (err) {
      toast.error('Failed to Load messages!', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

   const typingHandler = (e) => {
     setNewMessage(e.target.value);

     if (!socketConnected) return;

     if (!typing) {
       setTyping(true);
       socket.emit('typing', selectedChat._id);
     }

     let lastTypingTime = new Date().getTime();

     var timerLength = 2000;
     setTimeout(() => {
       var timeNow = new Date().getTime();
       var timeDiff = timeNow - lastTypingTime;

       if (timeDiff >= timerLength && typing) {
         socket.emit('stop typing', selectedChat._id);
         setTyping(false);
       }
     }, timerLength);
   };

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage('');

        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (err) {
        toast.error('Failed to send message!', {
          autoClose: 10000,
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };


  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  // console.log(notification, "THIS IS THE NOTIFICATION");

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

 

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontFamily={montdis}
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w='100%'
            // fontFamily='Work sans'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
              _hover={{ bg: gradientColor }}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'flex-end'}
            p={3}
            bg={primaryColor}
            w={'100%'}
            h={'100%'}
            borderRadius={'lg'}
            overflow={'hidden'}
          >
            {loading ? (
              <Spinner
                size={'xl'}
                w={20}
                h={20}
                alignSelf={'center'}
                margin={'auto'}
              />
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                color='#1F2833'
                variant={'filled'}
                bg={secondaryColor}
                placeholder='Type message...'
                focusBorderColor={blueOne}
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          h={'100%'}
        >
          <ToastContainer />
          <Text fontSize={'3xl'} pb={3} fontFamily={'Montserrat'}>
            <ArrowForwardIcon color={blueTwo} /> Send and recieve messages.
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
