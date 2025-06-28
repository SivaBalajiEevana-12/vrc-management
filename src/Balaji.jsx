"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  ChakraProvider,
  Container,
  Heading,
  Select,
  Text,
  VStack,
  HStack,
  Spinner,
  useToast,
  Divider,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Input,
} from "@chakra-ui/react";
import Layout from "./components/Layout";

const Balaji = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const cancelRef = useRef();
  const toast = useToast();
  const { id } = useParams(); // 🆕 Get ID from route

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("https://vrc-server-110406681774.asia-south1.run.app");
      const data = await res.json();
      setVolunteers(data);
    } catch (error) {
      console.error("Failed to fetch volunteers:", error);
      toast({
        title: "Fetch Error",
        description: "Could not load volunteer data.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(
        "https://vrc-server-110406681774.asia-south1.run.app/service"
      );
      const data = await res.json();
      setServiceOptions(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast({
        title: "Fetch Error",
        description: "Could not load service types.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const confirmServiceTypeChange = (id, newType) => {
    setSelectedUpdate({ id, newType });
    setIsDialogOpen(true);
  };

  const performUpdate = async () => {
    const { id, newType } = selectedUpdate;
    try {
      await fetch(`https://vrc-server-110406681774.asia-south1.run.app/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType: newType }),
      });

      toast({
        title: "Updated",
        description: "Service type updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setVolunteers((prev) =>
        prev.map((v) => (v._id === id ? { ...v, serviceType: newType } : v))
      );
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        title: "Update Error",
        description: "Could not update service type.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchVolunteers(), fetchServices()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // 🆕 Filter by ID (from route) or search term
  const filteredVolunteers = id
    ? volunteers.filter((v) => v._id === id)
    : volunteers.filter((v) =>
        v.whatsappNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  if (loading) {
    return (
      <ChakraProvider>
        <Layout>
          <Container centerContent py={10}>
            <Spinner size="xl" />
          </Container>
        </Layout>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Layout>
        <Box bg="gray.50" minH="100vh" py={8}>
          <Container maxW="2xl">
            <Heading size="lg" mb={6} color="teal.600">
              Volunteer Service Type Assignment
            </Heading>

            {!id && (
              <Input
                placeholder="Search by WhatsApp Number"
                mb={6}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}

            <VStack spacing={6} align="stretch">
              {filteredVolunteers.map((volunteer) => (
                <Box
                  key={volunteer._id}
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="white"
                >
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold">{volunteer.name}</Text>
                    <Text fontSize="sm">
                      WhatsApp: {volunteer.whatsappNumber}
                    </Text>
                    <Text fontSize="sm">
                      Locality: {volunteer.currentLocality}
                    </Text>
                    <Text fontSize="sm">
                      Service Availability: {volunteer.serviceAvailability}
                    </Text>

                    <Divider />

                    <HStack width="100%">
                      <Text fontSize="sm" minW="120px">
                        Service Type:
                      </Text>
                      <Select
                        placeholder="Select service type"
                        value={volunteer.serviceType}
                        onChange={(e) =>
                          confirmServiceTypeChange(
                            volunteer._id,
                            e.target.value
                          )
                        }
                      >
                        {serviceOptions.map((service) => (
                          <option key={service._id} value={service.name}>
                            {service.name}
                          </option>
                        ))}
                      </Select>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Container>
        </Box>

        {/* AlertDialog for confirmation */}
        <AlertDialog
          isOpen={isDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsDialogOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirm Update
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to update the service type?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button colorScheme="teal" onClick={performUpdate} ml={3}>
                  Confirm
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Layout>
    </ChakraProvider>
  );
};

export default Balaji;
