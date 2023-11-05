import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/layout';
import {
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Spinner,
} from '@chakra-ui/react';
import NotificationBadge, { Effect } from 'react-notification-badge';
import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/avatar';
import { ChatState } from '../../context/chatProvider';
import ChatLoading from '../ChatLoading';
import ProfileModal from './ProfileModal';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const montSub = 'Montserrat Subrayada';
const montdis= 'Montserrat Display';
const primaryColor = '#fefefe';
const secondaryColor = '#1F2833';
// const greyColor = '#C5C6C7';
const blueOne = 'linear-gradient(to left, #05445e, #189ab4);';
const blueTwo = 'linear-gradient(to left, #189ab4, #05445e );';

const SideBar = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
 
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warn('Please Enter something in search',{
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/auth/allusers?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast.error('An Error occured oppsie!', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/chat', { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toast.error('Error fetching the chat', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        bg={primaryColor}
        w={'100%'}
        p={'5px 10px 5px 10px'}
        borderWidth={'2px'}
        borderRadius={'3px'}
        borderColor={blueOne}
      >
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={'2xl'} m={1} color='#05445e' />
            </MenuButton>
            <MenuList color={'black'} pl={2}>
              {!notification.length && 'No New Messages'}
              {notification.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotification(notification.filter((n) => n !== noti));
                  }}
                >
                  {noti.chat.isGroupChat
                    ? `New Message in ${noti.chat.chatName}`
                    : `New Message from ${getSender(user, noti.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              bg={blueTwo}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size={'sm'}
                cursor={'pointer'}
                name={user.username}
                src={user.pic}
              />
            </MenuButton>
            <MenuList bg={primaryColor}>
              <ProfileModal user={user}>
                <MenuItem
                  style={{ color: blueOne }}
                  bg={primaryColor}
                  color='black'
                >
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                style={{ color: 'red' }}
                bg={primaryColor}
                onClick={logoutHandler}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>

        <Text
          fontFamily={montdis}
          fontSize={'4xl'}
          textAlign={'center'}
          color={secondaryColor}
        >
          Affinity
        </Text>

        <Tooltip label='Search Users to Chat With' hasArrow placement='bottom'>
          <Button
            variant={'ghost'}
            bg={blueOne}
            margin={'5px'}
            onClick={onOpen}
          >
            <i
              class='fa-solid fa-magnifying-glass'
              style={{ color: secondaryColor }}
            ></i>
            <Text
              display={{ base: 'none', md: 'flex' }}
              px={'4'}
              color={secondaryColor}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>
      </Box>

      <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={secondaryColor}>
          <DrawerHeader
            borderBottomWidth={'1px'}
            color={'white'}
            fontFamily={'Montserrat'}
          >
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display={'flex'} pb={2}>
              <Input
                color={'white'}
                focusBorderColor={blueOne}
                placeholder='Search by username or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} bg={blueTwo}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <Spinner ml='auto' display={'flex'} color={blueOne} />
            )}
          </DrawerBody>
        </DrawerContent>
        <ToastContainer />
      </Drawer>
    </>
  );
};

export default SideBar;
