
import {
  Box,
  VStack,
  Text,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Button,
} from "@chakra-ui/react";
import { Link, Navigate } from "react-router-dom";


const handleLogout = () => {
  localStorage.clear("token");
  <Navigate to={"/api/admin/login"}/>
  window.location.reload()
}

const SidebarContent = ({ onClose }) => (
  

  <VStack align="stretch" spacing="2" p="3">
    <Text fontSize="2xl" fontWeight="bold" mb="6" textAlign="center">
      Vcc-Volunteer
    </Text>

    {[
      { label: "All Volunteers", path: "/" },
      // { label: "Assign-Service", path: "/service" },
      { label: "Send-MeetUp Message", path: "/meetup" },
      {label:'service-Coordinatar',path:"/servicecoordinatorform"},
      // { label: "Volunteer-Manager", path: "/Registeration" },
      // { label: "Managers", path: "/manager" },
      // { label: "Services", path: "/service-list" },
      // // { label: "Attendance", path: "/attendence" },
      // { label: "FLC-Attendance", path: "/fcuser/attendece" },
      // { label: "Bahuda Ratha Yatra-Attendance", path: "/july/user/attendece" },
      // {label:"Flc-2 Attendance",path:"/july/flc/attendece"}


     

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
    <Button color={"red"} mt={2} onClick={handleLogout}>LogOut</Button>
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
