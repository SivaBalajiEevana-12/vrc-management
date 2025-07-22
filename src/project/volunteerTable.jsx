import Sidebar from '../components/Sidebar';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  VStack,
  Badge,
  Input,
  Select,
  HStack,
  Avatar,
  Spinner,
  useToast,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import axios from 'axios';
import Layout from '../components/Layout';

const VolunteerTableWithModal = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filters, setFilters] = useState({ name: '', whatsapp: '', slot: '' });
  const [serviceCoordinators, setServiceCoordinators] = useState([]);
  const [assigning, setAssigning] = useState({});
  const toast = useToast();

  const [serviceSelection, setServiceSelection] = useState({});
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchVolunteers();
  }, []);
  //https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers
  const fetchVolunteers = async () => {
    try {
      const res = await axios.get('https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers');
      const cleanedData = res.data.filter((v) => v && v.name);
      setVolunteers(cleanedData);
      setFilteredVolunteers(cleanedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    axios
      .get('https://vrc-server-110406681774.asia-south1.run.app/servicecoordinator')
      .then((res) => {
        setServiceCoordinators(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const filtered = volunteers.filter((v) => {
      const matchesName = v.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesWhatsapp = v.whatsappNumber.includes(filters.whatsapp);
      const matchesSlot =
        filters.slot === '' ||
        v.serviceAvailability.some((slot) => slot.date === filters.slot);
      return matchesName && matchesWhatsapp && matchesSlot;
    });
    setFilteredVolunteers(filtered);
  }, [filters, volunteers]);

  const handleRowClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    onOpen();
  };

  const handleServiceChange = async (volId, value) => {
    setServiceSelection((prev) => ({
      ...prev,
      [volId]: value,
    }));

    setAssigning((prev) => ({ ...prev, [volId]: true }));

    try {
      await axios.patch(
        `https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers/${volId}`,
        { assignedService: value }
      );

      setVolunteers((prev) =>
        prev.map((v) =>
          v._id === volId
            ? { ...v, assignedService: value }
            : v
        )
      );
      setFilteredVolunteers((prev) =>
        prev.map((v) =>
          v._id === volId
            ? { ...v, assignedService: value }
            : v
        )
      );

      toast({
        title: "Success",
        description: "Assigned service coordinator updated.",
        status: "success",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update.",
        status: "error",
        duration: 3000,
      });
    }
    setAssigning((prev) => ({ ...prev, [volId]: false }));
  };

  const handleDeleteVolunteer = async (volId) => {
    setDeleting(true);
    try {
      await axios.delete(
        `https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers/${volId}`
      );
      toast({
        title: "Deleted",
        description: "Volunteer has been deleted.",
        status: "success",
        duration: 2000,
      });
      setSelectedVolunteer(null);
      onClose();
      // Refresh volunteers list
      fetchVolunteers();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete volunteer.",
        status: "error",
        duration: 3000,
      });
    }
    setDeleting(false);
  };

  const getServiceName = (serviceId) => {
    const found = serviceCoordinators.find((s) => s._id === serviceId);
    return found ? found.serviceName : '';
  };

  return (
    <Layout>
      <Box p={6} overflowX="auto">
        {/* Volunteer count at top */}
        <Flex align="center" justify="space-between" mb={4}>
          <Alert status="info" borderRadius="md" maxW="380px">
            <AlertIcon />
            <AlertTitle>
              Total Volunteers Registered: {volunteers.length}
            </AlertTitle>
          </Alert>
        </Flex>

        <HStack spacing={4} mb={4} flexWrap="wrap">
          <Input
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            maxW="200px"
          />
          <Input
            placeholder="Search by WhatsApp"
            value={filters.whatsapp}
            onChange={(e) => setFilters({ ...filters, whatsapp: e.target.value })}
            maxW="200px"
          />
          <Select
            placeholder="Filter by Slot Date"
            value={filters.slot}
            onChange={(e) => setFilters({ ...filters, slot: e.target.value })}
            maxW="220px"
          >
            <option value="August 14">Service Availability for August 14</option>
            <option value="August 15">Service Availability for August 15</option>
            <option value="August 16">Service Availability for August 16</option>
            <option value="August 17">Service Availability for August 17</option>
          </Select>
        </HStack>

        <Table variant="simple" size="md">
          <Thead bg="teal.500">
            <Tr>
              <Th color="white">S.No</Th>
              <Th color="white">Image</Th>
              <Th color="white">Name</Th>
              <Th color="white">WhatsApp</Th>
              <Th color="white">Gender</Th>
              <Th color="white">Age</Th>
              <Th color="white">Service Availability</Th>
              {/* <Th color="white">Assigned Service</Th> */}
              <Th color="white">Assign</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredVolunteers.map((volunteer, idx) => (
              <Tr key={volunteer._id} _hover={{ bg: 'gray.100', cursor: 'pointer' }}>
                <Td>{idx + 1}</Td>
                <Td>
                  {volunteer.imageUrl ? (
                    <Avatar size="xl" name={volunteer.name} src={volunteer.imageUrl} />
                  ) : (
                    <Avatar size="xl" name={volunteer.name} />
                  )}
                </Td>
                <Td onClick={() => handleRowClick(volunteer)}>{volunteer.name}</Td>
                <Td onClick={() => handleRowClick(volunteer)}>{volunteer.whatsappNumber}</Td>
                <Td onClick={() => handleRowClick(volunteer)}>{volunteer.gender}</Td>
                <Td onClick={() => handleRowClick(volunteer)}>{volunteer.age}</Td>
                <Td>
                  {volunteer.serviceAvailability && volunteer.serviceAvailability.length > 0 ? (
                    <VStack align="start" spacing={1}>
                      {volunteer.serviceAvailability.map((slot) => (
                        <Badge key={slot._id || slot.date + slot.timeSlot} colorScheme="teal" mr={1} mb={1}>
                          {slot.date} - {slot.timeSlot}
                        </Badge>
                      ))}
                    </VStack>
                  ) : (
                    <Badge colorScheme="gray">-</Badge>
                  )}
                </Td>
                {/* <Td>
                  {getServiceName(volunteer.assignedService) || (
                    <Badge colorScheme="gray">Unassigned</Badge>
                  )}
                </Td> */}
                <Td>
                  <HStack>
                    <Select
                      placeholder="Assign Service"
                      size="sm"
                      maxW="140px"
                      value={serviceSelection[volunteer._id] || volunteer.assignedService || ''}
                      onChange={(e) =>
                        handleServiceChange(volunteer._id, e.target.value)
                      }
                      isDisabled={assigning[volunteer._id]}
                    >
                      {serviceCoordinators.map((svc) => (
                        <option key={svc._id} value={svc._id}>
                          {svc.serviceName}
                        </option>
                      ))}
                    </Select>
                    {assigning[volunteer._id] && <Spinner size="sm" />}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {selectedVolunteer && (
          <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered motionPreset="scale">
            <ModalOverlay backdropFilter="blur(6px) hue-rotate(30deg)" />
            <ModalContent borderRadius="2xl" bgGradient="linear(to-br, white, teal.50)" boxShadow="2xl">
              <ModalHeader color="teal.700" fontSize="2xl">Volunteer Details</ModalHeader>
              <ModalCloseButton color="gray.600" />
              <ModalBody>
                <VStack align="start" spacing={3} fontSize="md">
                  <Text><strong>Name:</strong> {selectedVolunteer.name}</Text>
                  <Text><strong>WhatsApp:</strong> {selectedVolunteer.whatsappNumber}</Text>
                  <Text><strong>DOB:</strong> {new Date(selectedVolunteer.dateOfBirth).toLocaleDateString()}</Text>
                  <Text><strong>Gender:</strong> {selectedVolunteer.gender}</Text>
                  <Text><strong>Age:</strong> {selectedVolunteer.age}</Text>
                  <Text><strong>Marital Status:</strong> {selectedVolunteer.maritalStatus || '-'}</Text>
                  <Text><strong>Profession:</strong> {selectedVolunteer.profession || '-'}</Text>
                  <Text><strong>College/Company:</strong> {selectedVolunteer.collegeOrCompany || '-'}</Text>
                  <Text><strong>Locality:</strong> {selectedVolunteer.locality || '-'}</Text>
                  <Text><strong>Referred By:</strong> {selectedVolunteer.referredBy}</Text>
                  <Text><strong>Info Source:</strong> {selectedVolunteer.infoSource}</Text>
                  <Text><strong>Accommodation:</strong> {selectedVolunteer.needAccommodation ? "Yes" : "NO"}</Text>
                  <Box>
                    <Text><strong>Service Availability:</strong></Text>
                    {selectedVolunteer.serviceAvailability.map((slot) => (
                      <Badge key={slot._id || slot.date + slot.timeSlot} colorScheme="teal" mr={2} mt={1}>
                        {slot.date} - {slot.timeSlot}
                      </Badge>
                    ))}
                  </Box>
                  <Box>
                    <Text><strong>Assigned Service:</strong></Text>
                    {(() => {
                      const svc = serviceCoordinators.find(
                        (s) => s._id === selectedVolunteer.assignedService
                      );
                      if (svc) {
                        return (
                          <VStack align="start" spacing={1}>
                            <Badge colorScheme="green" fontSize="lg">{svc.serviceName}</Badge>
                            <Text><strong>Coordinator Name:</strong> {svc.coordinatorName}</Text>
                            <Text><strong>Coordinator Number:</strong> {svc.coordinatorNumber}</Text>
                          </VStack>
                        );
                      } else {
                        return <Badge colorScheme="gray">Unassigned</Badge>;
                      }
                    })()}
                  </Box>
                  <Box>
                    <Text><strong>Photo:</strong></Text>
                    {selectedVolunteer.imageUrl ? (
                      <Avatar size="xl" name={selectedVolunteer.name} src={selectedVolunteer.imageUrl} />
                    ) : (
                      <Avatar size="xl" name={selectedVolunteer.name} />
                    )}
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="red"
                  mr={3}
                  borderRadius="full"
                  onClick={() => handleDeleteVolunteer(selectedVolunteer._id)}
                  isLoading={deleting}
                >
                  Delete
                </Button>
                <Button colorScheme="teal" onClick={onClose} borderRadius="full">
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </Layout>
  );
};

export default VolunteerTableWithModal;