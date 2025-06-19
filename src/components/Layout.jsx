// components/Layout.js
import React, { useState } from 'react';
import { Box, IconButton, Flex, useBreakpointValue } from '@chakra-ui/react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      {isMobile && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          width="100%"
          bg="gray.800"
          color="white"
          zIndex="1100"
          p={4}
          alignItems="center"
        >
          <IconButton
            icon={isSidebarOpen ? <X /> : <Menu />}
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            variant="ghost"
            color="white"
            fontSize="20px"
          />
          <Box fontWeight="bold" ml={4}>
            VRC Admin
          </Box>
        </Flex>
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        ml={{ base: 0, md: "250px" }}
        pt={{ base: "60px", md: 0 }} // push down on mobile to avoid button overlap
        p="6"
        minH="100vh"
        bg="gray.50"
      >
        {children}
      </Box>
    </>
  );
};

export default Layout;
