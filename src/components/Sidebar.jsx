// components/Sidebar.js
import {
  Box,
  VStack,
  Text,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const SidebarContent = ({ onClose }) => (
  <VStack align="stretch" spacing="4" p="5">
    <Text fontSize="2xl" fontWeight="bold" mb="6" textAlign="center">
      My Sidebar
    </Text>

    {[
      { label: "Users", path: "/" },
      { label: "Assign-Service", path: "/service" },
      { label: "Send-MeetUp Message", path: "/meetup" },
      { label: "Volunteer-Manager", path: "/Registeration" },
      { label: "Managers", path: "/manager" },
      { label: "Services", path: "/service-list" },
    ].map(({ label, path }) => (
      <Box
        as={Link}
        to={path}
        _hover={{ bg: "gray.700" }}
        p="3"
        borderRadius="md"
        onClick={onClose}
        key={label}
      >
        {label}
      </Box>
    ))}
  </VStack>
);

const Sidebar = ({ isOpen, onClose }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800" color="white">
          <DrawerBody>
            <SidebarContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Box
      position="fixed"
      left="0"
      top="0"
      width="250px"
      height="100vh"
      bg="gray.800"
      color="white"
      zIndex="1000"
      p="5"
    >
      <SidebarContent />
    </Box>
  );
};

export default Sidebar;
