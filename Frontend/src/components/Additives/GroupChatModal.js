import React from 'react';
import {useDisclosure,Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,Button,FormControl,Input,Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ChatState } from '../../context/chatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const primaryColor = '#fefefe';
const secondaryColor = '#1F2833';

const blueOne = 'linear-gradient(to left, #05445e, #189ab4)';
// const blueTwo = 'linear-gradient(to left, #189ab4, #05445e );';
const gradientColor = 'linear-gradient(to left, #75e6da, #d4f1f4 )';

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/auth/allusers?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast.error('Error Occured!', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

   const handleGroup = (userToAdd) => {
     if (selectedUsers.includes(userToAdd)) {
       toast.warn('User already added', {
         autoClose: 10000,
         position: toast.POSITION.TOP_RIGHT,
       });
       return;
     }

     setSelectedUsers([...selectedUsers, userToAdd]);
   };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warn('Please fill in all fields', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast.success('Created New Group Chat !', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
      toast.error('Failed to Create the Chat oui!', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };

 

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={secondaryColor}>
          <ModalHeader
            fontSize={'35px'}
            fontFamily={'Roboto Condensed'}
            color={'white'}
            display={'flex'}
            justifyContent={'center'}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton color={blueOne} _hover={{ bg: primaryColor }} />
          <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
            <FormControl>
              <Input
                placeholder='Chat Name'
                focusBorderColor={blueOne}
                color={'white'}
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add Users'
                focusBorderColor={blueOne}
                color={'white'}
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={'flex'} flexWrap={'wrap'} w={'100%'}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button _hover={{ bg: gradientColor }} mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
        <ToastContainer/>
      </Modal>
    </>
  );
};

export default GroupChatModal;
