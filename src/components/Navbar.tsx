import { Box, Flex, Link, Heading } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <Box bg="teal.500" px={4} py={3}>
      <Flex maxW="container.xl" mx="auto" align="center" justify="space-between">
        <Heading size="md" color="white">
          Uaibnb Admin
        </Heading>
        <Flex gap={6}>
          <Link as={RouterLink} to="/" color="white" fontWeight="medium">
            Locações
          </Link>
          <Link as={RouterLink} to="/characteristics" color="white" fontWeight="medium">
            Características
          </Link>
          <Link as={RouterLink} to="/preview" color="white" fontWeight="medium">
            Pré-visualização
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar; 