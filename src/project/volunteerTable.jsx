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
  HStack,
  Avatar,
  Spinner,
  useToast,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  Select,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
} from '@chakra-ui/icons';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const SIDEBAR_WIDTH = 250;
const PAGE_SIZE = 20;

const VolunteerTable = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({ name: '', whatsapp: '' });
  const [serviceCoordinators, setServiceCoordinators] = useState([]);
  const [assigning, setAssigning] = useState({});
  const [serviceSelection, setServiceSelection] = useState({});
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Helper: get assigned service id robustly and ensure it matches coordinator list
  const getDropdownValue = (vol) => {
    if (serviceSelection[vol._id] !== undefined) return serviceSelection[vol._id];
    const assignedId =
      typeof vol.assignedService === 'object'
        ? vol.assignedService?._id?.toString()
        : vol.assignedService?.toString();
    if (
      assignedId &&
      serviceCoordinators.some((svc) => svc._id?.toString() === assignedId)
    ) {
      return assignedId;
    }
    return '';
  };

  const fetchVolunteers = async (page = 1, name = '', whatsapp = '') => {
    try {
      const params = {
        page,
        pageSize: PAGE_SIZE,
        ...(name ? { name } : {}),
        ...(whatsapp ? { whatsapp } : {}),
      };
      const res = await axios.get(
        'https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers',
        { params }
      );
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      setVolunteers(list);
      setTotalVolunteers(res.data.totalCount || 0);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Unable to fetch volunteers.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchVolunteers(1, filters.name, filters.whatsapp);
    setCurrentPage(1);
    setServiceSelection({});
  }, [filters.name, filters.whatsapp]);

  useEffect(() => {
    fetchVolunteers(currentPage, filters.name, filters.whatsapp);
  }, [currentPage]);

  useEffect(() => {
    axios
      .get(
        'https://vrc-server-110406681774.asia-south1.run.app/servicecoordinator'
      )
      .then(res => {
        setServiceCoordinators(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleRowClick = volunteer => {
    setSelectedVolunteer(volunteer);
    onOpen();
  };

  // *** FIXED: send full object, not just ID ***
  const handleServiceChange = async (volId, selectedCoordinatorId) => {
    setServiceSelection(prev => ({
      ...prev,
      [volId]: selectedCoordinatorId,
    }));
    setAssigning(prev => ({ ...prev, [volId]: true }));
    try {
      // Find full coordinator object for the selected id
      const coordinator = serviceCoordinators.find(
        svc => svc._id.toString() === selectedCoordinatorId
      );
      if (!coordinator) throw new Error("Coordinator not found");

      // Only send the required fields
      const assignedServiceObj = {
        _id: coordinator._id,
        serviceName: coordinator.serviceName,
        coordinatorName: coordinator.coordinatorName,
        coordinatorNumber: coordinator.coordinatorNumber,
      };

      await axios.patch(
        `https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers/${volId}`,
        { assignedService: assignedServiceObj }
      );
      fetchVolunteers(currentPage, filters.name, filters.whatsapp);
      toast({
        title: 'Success',
        description: 'Assigned service coordinator updated.',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update.',
        status: 'error',
        duration: 3000,
      });
    }
    setAssigning(prev => ({ ...prev, [volId]: false }));
  };

  const handleDeleteVolunteer = async volId => {
    setDeleting(true);
    try {
      await axios.delete(
        `https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers/${volId}`
      );
      toast({
        title: 'Deleted',
        description: 'Volunteer has been deleted.',
        status: 'success',
        duration: 2000,
      });
      setSelectedVolunteer(null);
      onClose();
      fetchVolunteers(currentPage, filters.name, filters.whatsapp);
    } catch (err) {
      toast({
        title: 'Error',
        description:
          err.response?.data?.message || 'Failed to delete volunteer.',
        status: 'error',
        duration: 3000,
      });
    }
    setDeleting(false);
  };

  const handleExportToSheet = async () => {
    setExporting(true);
    try {
      const params = {
        all: 'true',
        ...(filters.name ? { name: filters.name } : {}),
        ...(filters.whatsapp ? { whatsapp: filters.whatsapp } : {}),
      };
      const res = await axios.get(
        'https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers',
        { params }
      );
      const allVolunteers = Array.isArray(res.data.data) ? res.data.data : [];
      const exportRes = await axios.post(
        'https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/export-volunteers',
        { volunteers: allVolunteers }
      );
      toast({
        title: 'Export Successful',
        description: exportRes.data.message,
        status: 'success',
        duration: 4000,
      });
    } catch (err) {
      toast({
        title: 'Export Failed',
        description:
          err.response?.data?.message || 'Failed to export volunteers.',
        status: 'error',
        duration: 4000,
      });
    }
    setExporting(false);
  };

  const pageCount = Math.ceil(totalVolunteers / PAGE_SIZE);

  return (
    <Box minH="100vh" bg="gray.50">
      {isMobile && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="1000"
          bg="gray.800"
          px={4}
          py={3}
          align="center"
          justify="space-between"
          boxShadow="md"
          color={'white'}
        >
          <HStack>
            <IconButton
              icon={<HamburgerIcon />}
              variant="ghost"
              colorScheme="white"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              fontSize="2xl"
            />
            <Text fontWeight="bold" fontSize="xl">
              Vcc-Volunteer
            </Text>
          </HStack>
        </Flex>
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        as="main"
        flex="1"
        p={6}
        minH="100vh"
        transition="all 0.2s"
        ml={{ base: 0, md: `${SIDEBAR_WIDTH}px` }}
      >
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          align={{ base: 'left', md: 'center' }}
          justify="space-between"
          mt={['60px', null, null, null]}
          mb={4}
        >
          <Alert status="info" borderRadius="md" maxW="380px">
            <AlertIcon />
            <AlertTitle>
              Total Volunteers Registered: {totalVolunteers}
            </AlertTitle>
          </Alert>
          <Button
            colorScheme="teal"
            leftIcon={<DownloadIcon />}
            onClick={handleExportToSheet}
            isLoading={exporting}
            loadingText="Exporting"
            ml={['0px', 4, 4, 4]}
            mt={['10px', null, null, null]}
          >
            Export to Google Sheet
          </Button>
        </Flex>

        <HStack spacing={4} mb={4} flexWrap="wrap">
          <Input
            placeholder="Search by name"
            value={filters.name}
            onChange={e => setFilters({ ...filters, name: e.target.value })}
            maxW="200px"
          />
          <Input
            placeholder="Search by WhatsApp"
            value={filters.whatsapp}
            onChange={e => setFilters({ ...filters, whatsapp: e.target.value })}
            maxW="200px"
          />
        </HStack>

        <Flex align="center" justify="flex-end" mb={2}>
          <Button
            size="sm"
            leftIcon={<ChevronLeftIcon />}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            isDisabled={currentPage === 1}
            mr={2}
          >
            Prev
          </Button>
          <Text fontSize="md">
            Page {currentPage} of {pageCount}
          </Text>
          <Button
            size="sm"
            rightIcon={<ChevronRightIcon />}
            onClick={() => setCurrentPage(p => Math.min(p + 1, pageCount))}
            isDisabled={currentPage >= pageCount}
            ml={2}
          >
            Next
          </Button>
        </Flex>

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
              <Th color="white">Assign</Th>
            </Tr>
          </Thead>
          <Tbody>
            {volunteers.map((volunteer, idx) => (
              <Tr
                key={volunteer._id}
                _hover={{ bg: 'gray.100', cursor: 'pointer' }}
              >
                <Td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</Td>
                <Td>
                  {volunteer.imageUrl ? (
                    <Avatar
                      size="xl"
                      name={volunteer.name}
                      src={volunteer.imageUrl}
                    />
                  ) : (
                    <Avatar size="xl" name={volunteer.name} />
                  )}
                </Td>
                <Td onClick={() => handleRowClick(volunteer)}>
                  {volunteer.name}
                </Td>
                <Td onClick={() => handleRowClick(volunteer)}>
                  {volunteer.whatsappNumber}
                </Td>
                <Td onClick={() => handleRowClick(volunteer)}>
                  {volunteer.gender}
                </Td>
                <Td onClick={() => handleRowClick(volunteer)}>
                  {volunteer.age}
                </Td>
                <Td>
                  {volunteer.serviceAvailability &&
                  volunteer.serviceAvailability.length > 0 ? (
                    <VStack align="start" spacing={1}>
                      {volunteer.serviceAvailability.map(slot => (
                        <Badge
                          key={slot._id || slot.date + slot.timeSlot}
                          colorScheme="teal"
                          mr={1}
                          mb={1}
                        >
                          {slot.date} - {slot.timeSlot}
                        </Badge>
                      ))}
                    </VStack>
                  ) : (
                    <Badge colorScheme="gray">-</Badge>
                  )}
                </Td>
                <Td>
                  <HStack>
                    <Select
                      placeholder="Assign Service"
                      size="sm"
                      maxW="140px"
                      value={getDropdownValue(volunteer)}
                      onChange={e =>
                        handleServiceChange(volunteer._id, e.target.value)
                      }
                      isDisabled={assigning[volunteer._id]}
                    >
                      {serviceCoordinators.map(svc => (
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

        <Flex align="center" justify="flex-end" my={4}>
          <Button
            size="sm"
            leftIcon={<ChevronLeftIcon />}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            isDisabled={currentPage === 1}
            mr={2}
          >
            Prev
          </Button>
          <Text fontSize="md">
            Page {currentPage} of {pageCount}
          </Text>
          <Button
            size="sm"
            rightIcon={<ChevronRightIcon />}
            onClick={() => setCurrentPage(p => Math.min(p + 1, pageCount))}
            isDisabled={currentPage >= pageCount}
            ml={2}
          >
            Next
          </Button>
        </Flex>

        {selectedVolunteer && (
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            isCentered
            motionPreset="scale"
          >
            <ModalOverlay backdropFilter="blur(6px) hue-rotate(30deg)" />
            <ModalContent
              borderRadius="2xl"
              bgGradient="linear(to-br, white, teal.50)"
              boxShadow="2xl"
            >
              <ModalHeader color="teal.700" fontSize="2xl">
                Volunteer Details
              </ModalHeader>
              <ModalCloseButton color="gray.600" />
              <ModalBody>
                <VStack align="start" spacing={3} fontSize="md">
                  <Text>
                    <strong>Name:</strong> {selectedVolunteer.name}
                  </Text>
                  <Text>
                    <strong>WhatsApp:</strong>{' '}
                    {selectedVolunteer.whatsappNumber}
                  </Text>
                  <Text>
                    <strong>DOB:</strong>{' '}
                    {selectedVolunteer.dateOfBirth
                      ? new Date(
                          selectedVolunteer.dateOfBirth
                        ).toLocaleDateString()
                      : '-'}
                  </Text>
                  <Text>
                    <strong>Gender:</strong> {selectedVolunteer.gender}
                  </Text>
                  <Text>
                    <strong>Age:</strong> {selectedVolunteer.age}
                  </Text>
                  <Text>
                    <strong>Marital Status:</strong>{' '}
                    {selectedVolunteer.maritalStatus || '-'}
                  </Text>
                  <Text>
                    <strong>Profession:</strong>{' '}
                    {selectedVolunteer.profession || '-'}
                  </Text>
                  <Text>
                    <strong>College/Company:</strong>{' '}
                    {selectedVolunteer.collegeOrCompany || '-'}
                  </Text>
                  <Text>
                    <strong>Locality:</strong>{' '}
                    {selectedVolunteer.locality || '-'}
                  </Text>
                  <Text>
                    <strong>Referred By:</strong> {selectedVolunteer.referredBy}
                  </Text>
                  <Text>
                    <strong>Info Source:</strong> {selectedVolunteer.infoSource}
                  </Text>
                  <Text>
                    <strong>Accommodation:</strong>{' '}
                    {selectedVolunteer.needAccommodation ? 'Yes' : 'NO'}
                  </Text>
                  <Box>
                    <Text>
                      <strong>Service Availability:</strong>
                    </Text>
                    {selectedVolunteer.serviceAvailability &&
                    selectedVolunteer.serviceAvailability.length > 0 ? (
                      selectedVolunteer.serviceAvailability.map(slot => (
                        <Badge
                          key={slot._id || slot.date + slot.timeSlot}
                          colorScheme="teal"
                          mr={2}
                          mt={1}
                        >
                          {slot.date} - {slot.timeSlot}
                        </Badge>
                      ))
                    ) : (
                      <Badge colorScheme="gray">-</Badge>
                    )}
                  </Box>
                  <Box>
                    <Text>
                      <strong>Assigned Service:</strong>
                    </Text>
                    {selectedVolunteer.assignedService &&
                    selectedVolunteer.assignedService.serviceName ? (
                      <VStack align="start" spacing={1}>
                        <Badge colorScheme="green" fontSize="lg">
                          {selectedVolunteer.assignedService.serviceName}
                        </Badge>
                        <Text>
                          <strong>Coordinator Name:</strong>{' '}
                          {selectedVolunteer.assignedService.coordinatorName}
                        </Text>
                        <Text>
                          <strong>Coordinator Number:</strong>{' '}
                          {selectedVolunteer.assignedService.coordinatorNumber}
                        </Text>
                      </VStack>
                    ) : (
                      <Badge colorScheme="gray">Unassigned</Badge>
                    )}
                  </Box>
                  <Box>
                    <Text>
                      <strong>Photo:</strong>
                    </Text>
                    {selectedVolunteer.imageUrl ? (
                      <Avatar
                        size="xl"
                        name={selectedVolunteer.name}
                        src={selectedVolunteer.imageUrl}
                      />
                    ) : (
                      <Avatar size="xl" name={selectedVolunteer.name} />
                    )}
                  </Box>
                  <Box>
                    <Text>
                      <strong>Attendance:</strong>
                    </Text>
                    {selectedVolunteer.attendance &&
                    selectedVolunteer.attendance.length > 0 ? (
                      <VStack align="start" spacing={1}>
                        {selectedVolunteer.attendance.map((a, idx) => (
                          <Badge
                            key={idx}
                            colorScheme={a.attended ? 'green' : 'red'}
                          >
                            {a.date} - {a.serviceType}:{' '}
                            {a.attended ? 'Present' : 'Absent'}
                          </Badge>
                        ))}
                      </VStack>
                    ) : (
                      <Badge colorScheme="gray">No attendance records</Badge>
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
                <Button
                  colorScheme="teal"
                  onClick={onClose}
                  borderRadius="full"
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </Box>
  );
};

export default VolunteerTable;