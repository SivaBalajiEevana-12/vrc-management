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
  HStack
} from '@chakra-ui/react';
import axios from 'axios';

const VolunteerTableWithModal = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filters, setFilters] = useState({ name: '', whatsapp: '', slot: '' });

  useEffect(() => {
    axios
      .get('https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers')
      .then((res) => {
        const cleanedData = res.data.filter((v) => v && v.name);
        setVolunteers(cleanedData);
        setFilteredVolunteers(cleanedData);
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

  return (
    <Box p={6} overflowX="auto">
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
            <Th color="white">Name</Th>
            <Th color="white">WhatsApp</Th>
            <Th color="white">Gender</Th>
            <Th color="white">Age</Th>
            <Th color="white">T-Shirt Size</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredVolunteers.map((volunteer) => (
            <Tr key={volunteer._id} onClick={() => handleRowClick(volunteer)} _hover={{ bg: 'gray.100', cursor: 'pointer' }}>
              <Td>{volunteer.name}</Td>
              <Td>{volunteer.whatsappNumber}</Td>
              <Td>{volunteer.gender}</Td>
              <Td>{volunteer.age}</Td>
              <Td>{volunteer.tshirtSize || '-'}</Td>
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
                <Text><strong>T-Shirt Size:</strong> {selectedVolunteer.tshirtSize || '-'}</Text>
                <Text><strong>Accommodation:</strong> {selectedVolunteer.needAccommodation || '-'}</Text>
                <Box>
                  <Text><strong>Service Availability:</strong></Text>
                  {selectedVolunteer.serviceAvailability.map((slot) => (
                    <Badge key={slot._id} colorScheme="teal" mr={2} mt={1}>
                      {slot.date} - {slot.timeSlot}
                    </Badge>
                  ))}
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={onClose} borderRadius="full">
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default VolunteerTableWithModal;
