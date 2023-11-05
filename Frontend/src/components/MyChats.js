import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatState } from '../context/chatProvider';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './Additives/GroupChatModal';

const montdis = 'Montserrat Display';
const primaryColor = '#DAF1F4';
const secondaryColor = 'linear-gradient(to left, #05445E, #189AB4 )';
const gradientColor = 'linear-gradient(to left, #75e6da, #d4f1f4 )';
// const black ='#66FCF1' ;
const blueOne = '#1F2833';
const blueTwo = '#45A29E';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/chat', config);

      setChats(data);
    } catch (err) {
      toast.error('oops Failed to load chats', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir={'column'}
      alignItems={'center'}
      p={3}
      bg={secondaryColor}
      w={{ base: '100%', md: '31%' }}
      borderRadius={'lg'}
      borderWidth={'1px'}
      borderColor={blueTwo}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily={'Roboto Condensed'}
        display={'flex'}
        w={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <GroupChatModal>
          <Button
            fontFamily={montdis}
            display={'flex'}
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
            _hover={{ bg: gradientColor }}
          >
            New Group
          </Button>
        </GroupChatModal>
        Chats
      </Box>

      <Box
        display={'flex'}
        flexDir={'column'}
        p={3}
        bg={primaryColor}
        w={'100%'}
        h={'100%'}
        borderRadius={'lg'}
        overflowY={'hidden'}
        fontFamily={'Montserrat'}
      >
        {chats ? (
          <Stack overflowY={'scroll'}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={'pointer'}
                bg={selectedChat === chat ? primaryColor : secondaryColor}
                color={selectedChat === chat ? blueOne : primaryColor}
                px={3}
                py={2}
                borderRadius={'lg'}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default MyChats;
