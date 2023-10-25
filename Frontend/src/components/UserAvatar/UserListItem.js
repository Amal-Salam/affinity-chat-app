// import { ChatState } from '../../context/chatProvider';
import { Avatar } from '@chakra-ui/avatar';
import { Box, Text } from '@chakra-ui/layout';

// color palette
const primaryColor ='#0B0C10';
const blueOne = '#66FCF1';
const blueTwo = '#45A29E';
// font
const montdis = 'Montserrat Display';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor={'pointer'}
      bg={primaryColor}
      _hover={{ background: blueTwo, color: 'white' }}
      w={'100%'}
      display={'flex'}
      alignItems={'center'}
      color={'black'}
      px={3}
      py={2}
      mb={2}
      borderRadius={'lg'}
    >
      <Avatar
        mr={2}
        size={'sm'}
        cursor={'pointer'}
        name={user.username}
        src={user.pic}
      />
      <Box>
        <Text fontFamily={montdis} color={blueOne}>
          {user.username}
        </Text>
        <Text fontFamily={montdis} color={'black'} fontSize={'xs'}>
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
