import { useState } from 'react';
import { Box } from '@chakra-ui/layout';
// import axios from "axios";
import { ChatState } from '../context/chatProvider';
import ChatBox from '../components/ChatBox';
import MyChats from '../components/MyChats';
import SideBar from '../components/Additives/Sidebar';

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();
  return (
    <div style={{ width: '100%' }}>
      {user && <SideBar />}
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        w={'100%'}
        h={'91.5vh'}
        p={'10px'}
      >
        
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && <MyChats fetchAgain={fetchAgain} />}
      </Box>
    </div>
  );
};

export default Chatpage;
