import { Box } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import React from 'react';

const gradientColor = 'linear-gradient(to left, #75e6da, #d4f1f4 )';
const primaryColor = "white";
// '#0B0C10';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={'lg'}
      m={1}
      mb={2}
      variant={'solid'}
      fontSize={12}
      backgroundColor={gradientColor}
      color={primaryColor}
      cursor={'pointer'}
      onClick={handleFunction}
    >
      {user.username}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
