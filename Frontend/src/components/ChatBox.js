import React from 'react';
import { ChatState } from '../context/chatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

// const primaryColor = '#0B0C10';
const secondaryColor = 'linear-gradient(to left, #05445E, #189AB4 )';
// const greyColor = '#C5C6C7';
// const blueOne = '#66FCF1';
const blueTwo = '#45A29E';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems={'center'}
      flexDir={'column'}
      p={3}
      bg={secondaryColor}
      w={{ base: '100%', md: '68%' }}
      borderRadius={'lg'}
      borderWidth={'1px'}
      borderColor={blueTwo}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
