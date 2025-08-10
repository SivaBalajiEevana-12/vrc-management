import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  useToast,
  HStack,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { FaPrayingHands } from "react-icons/fa";

const BG_IMG =
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1350&q=80"; 

function CheckServiceAssignment() {
  const [whatsapp, setWhatsapp] = useState("");
  const [checking, setChecking] = useState(false);
  const [service, setService] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const toast = useToast();

  const normalizeWhatsapp = (num) => num.replace(/\D/g, "");

  const fetchVolunteerData = async (whatsappNumber) => {
    try {
      const response = await fetch(
        `https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers/${whatsappNumber}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch volunteer data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
      return null;
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    setService(null);
    setNotFound(false);
    const normalized = normalizeWhatsapp(whatsapp);

    try {
      const volunteerData = await fetchVolunteerData(normalized);

      console.log('Volunteer Data:', volunteerData);

      if (!volunteerData) {
        setNotFound(true);
        return;
      }

      if (!volunteerData.assignedService || !volunteerData.assignedService._id) {
        setService(null);
        toast({
          title: "No Service Assigned.",
          description:
            "Your seva (service) will be assigned soon. Please contact your coordinator if you have questions.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        return;
      }


      const assignedService = volunteerData.assignedService;
      
      if (assignedService.serviceName === "nan" || 
          assignedService.coordinatorName === "nan" || 
          assignedService.coordinatorNumber === "nan" ||
          !assignedService.serviceName ||
          !assignedService.coordinatorName ||
          !assignedService.coordinatorNumber) {
        
        setService(null);
        toast({
          title: "Service Not Assigned Yet.",
          description:
            "Your seva (service) will be assigned soon. Please contact your coordinator if you have questions.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

 
      setService({
        serviceName: assignedService.serviceName,
        coordinatorName: assignedService.coordinatorName,
        coordinatorNumber: assignedService.coordinatorNumber,
      });
      
      toast({
        title: "Service Found!",
        description: `You are assigned to ${assignedService.serviceName}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error during service check:', error);
      setNotFound(true);
      toast({
        title: "Error",
        description: "Something went wrong while checking your service assignment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bgImage={`linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.93)), url('${BG_IMG}')`}
      bgRepeat="no-repeat"
      bgSize="cover"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        w="full"
        maxW="lg"
        bg="whiteAlpha.900"
        boxShadow="2xl"
        rounded="2xl"
        p={{ base: 6, md: 10 }}
        border="2px solid"
        borderColor="yellow.200"
      >
        <VStack spacing={6}>
          <HStack spacing={3}>
            <Icon as={FaPrayingHands} boxSize={10} color="yellow.400" />
            <Heading
              size="lg"
              color="orange.700"
              fontWeight="bold"
              textAlign="center"
              fontFamily="'Satisfy', cursive"
              letterSpacing="wider"
              mb={1}
            >
              Check My Seva Assignment
            </Heading>
          </HStack>
          <Text color="gray.600" fontSize="md" textAlign="center">
            Enter your WhatsApp number to know your assigned service for the festival.
          </Text>
          <HStack w="full">
            <Input
              placeholder="Enter WhatsApp Number"
              size="lg"
              variant="filled"
              bg="yellow.50"
              borderColor="yellow.200"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              maxW="70%"
              fontWeight="bold"
              fontSize="lg"
              _focus={{ borderColor: "orange.300", boxShadow: "0 0 0 2px #FEFCBF" }}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <Button
              colorScheme="orange"
              size="lg"
              px={8}
              isLoading={checking}
              onClick={handleCheck}
              leftIcon={checking ? <Spinner size="sm" /> : <FaPrayingHands />}
              disabled={!normalizeWhatsapp(whatsapp) || checking}
            >
              Check
            </Button>
          </HStack>

          {service && (
            <Box
              w="full"
              bg="yellow.50"
              border="1px solid"
              borderColor="yellow.200"
              p={6}
              rounded="lg"
              boxShadow="md"
              textAlign="center"
              mt={2}
            >
              <Text fontSize="2xl" color="orange.700" fontWeight="bold" mb={2}>
                🙏 Your Seva Assignment 🙏
              </Text>
              <Text fontSize="lg" mb={1}>
                <b>Service:</b> <span style={{ color: "#B7791F" }}>{service.serviceName}</span>
              </Text>
              <Text fontSize="lg" mb={1}>
                <b>Coordinator:</b> <span style={{ color: "#805AD5" }}>{service.coordinatorName}</span>
              </Text>
              <Text fontSize="lg">
                <b>Contact:</b> <span style={{ color: "#319795" }}>{service.coordinatorNumber}</span>
              </Text>
              <Text fontSize="sm" color="gray.600" mt={4}>
                Please reach out to your coordinator for more details and timings.
              </Text>
            </Box>
          )}

          {notFound && (
            <Text color="red.500" fontWeight="bold" mt={2}>
              Volunteer not found. Please check your WhatsApp number or contact admin.
            </Text>
          )}
        </VStack>
        <Text
          mt={10}
          color="yellow.700"
          fontSize="sm"
          textAlign="center"
          fontFamily="'Satisfy', cursive"
        >
          "Seva is the highest form of worship."<br />
          <span style={{ fontSize: "1.3em" }}>— Hare Krishna 🌸</span>
        </Text>
      </Box>
    </Box>
  );
}

export default CheckServiceAssignment;