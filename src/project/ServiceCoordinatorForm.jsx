import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Flex
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Layout from '../components/Layout';

const API_URL = 'https://vrc-server-110406681774.asia-south1.run.app/servicecoordinator';

const ServiceCoordinatorForm = () => {

  const [serviceName, setServiceName] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorNumber, setCoordinatorNumber] = useState('');
  const [loading, setLoading] = useState(false);


  const [coordinators, setCoordinators] = useState([]);
  const [fetching, setFetching] = useState(false);


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editId, setEditId] = useState('');
  const [editServiceName, setEditServiceName] = useState('');
  const [editCoordinatorName, setEditCoordinatorName] = useState('');
  const [editCoordinatorNumber, setEditCoordinatorNumber] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const toast = useToast();


  const fetchCoordinators = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API_URL}/`);
      setCoordinators(res.data);
    } catch (err) {
      toast({ title: 'Error', description: 'Could not fetch data', status: 'error', duration: 3000 });
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);


  const handleSubmit = async () => {
    if (!serviceName.trim() || !coordinatorName.trim() || !coordinatorNumber.trim()) {
      toast({ title: 'Error', description: 'All fields are required', status: 'error', duration: 3000 });
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/add`, {
        serviceName,
        coordinatorName,
        coordinatorNumber,
      });
      toast({ title: 'Success', description: 'Service and Coordinator added!', status: 'success', duration: 3000 });
      setServiceName('');
      setCoordinatorName('');
      setCoordinatorNumber('');
      fetchCoordinators();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Submission failed.',
        status: 'error',
        duration: 3000
      });
    }
    setLoading(false);
  };


  const handleEditOpen = (coordinator) => {
    setEditId(coordinator._id);
    setEditServiceName(coordinator.serviceName);
    setEditCoordinatorName(coordinator.coordinatorName);
    setEditCoordinatorNumber(coordinator.coordinatorNumber);
    onOpen();
  };


  const handleEditSave = async () => {
    if (!editServiceName.trim() || !editCoordinatorName.trim() || !editCoordinatorNumber.trim()) {
      toast({ title: 'Error', description: 'All fields are required', status: 'error', duration: 3000 });
      return;
    }
    setEditLoading(true);
    try {
      await axios.put(`${API_URL}/${editId}`, {
        serviceName: editServiceName,
        coordinatorName: editCoordinatorName,
        coordinatorNumber: editCoordinatorNumber,
      });
      toast({ title: 'Updated', description: 'Coordinator updated', status: 'success', duration: 3000 });
      onClose();
      fetchCoordinators();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Update failed.',
        status: 'error',
        duration: 3000
      });
    }
    setEditLoading(false);
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coordinator?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast({ title: 'Deleted', description: 'Coordinator deleted', status: 'success', duration: 3000 });
      fetchCoordinators();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Delete failed.',
        status: 'error',
        duration: 3000
      });
    }
  };

  return (
    <Layout>
      <Box maxW="400px" mx="auto" mt={12} p={6} borderRadius="xl" boxShadow="xl" bg="white">
        <VStack spacing={5} align="stretch">
          <Heading size="md" color="teal.600">Add Service & Coordinator</Heading>
          <FormControl isRequired>
            <FormLabel>Service Name</FormLabel>
            <Input value={serviceName} onChange={e => setServiceName(e.target.value)} placeholder="Enter service name" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Coordinator Name</FormLabel>
            <Input value={coordinatorName} onChange={e => setCoordinatorName(e.target.value)} placeholder="Enter coordinator name" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Coordinator Number</FormLabel>
            <Input value={coordinatorNumber} onChange={e => setCoordinatorNumber(e.target.value)} placeholder="Enter coordinator number" />
          </FormControl>
          <Button colorScheme="teal" onClick={handleSubmit} isLoading={loading}>
            Submit
          </Button>
        </VStack>
      </Box>

      <Box maxW="900px" mx="auto" mt={16} p={6} borderRadius="xl" boxShadow="xl" bg="white">
        <Heading size="md" mb={4} color="teal.600">Service Coordinators</Heading>
        {fetching ? (
          <Spinner />
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Service Name</Th>
                <Th>Coordinator Name</Th>
                <Th>Coordinator Number</Th>
                <Th>Added At</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {coordinators.map(coord => (
                <Tr key={coord._id}>
                  <Td>{coord.serviceName}</Td>
                  <Td>{coord.coordinatorName}</Td>
                  <Td>{coord.coordinatorNumber}</Td>
                  <Td>{new Date(coord.addedAt).toLocaleString()}</Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => handleEditOpen(coord)}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(coord._id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Coordinator</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={2}>
              <FormLabel>Service Name</FormLabel>
              <Input value={editServiceName} onChange={e => setEditServiceName(e.target.value)} />
            </FormControl>
            <FormControl isRequired mb={2}>
              <FormLabel>Coordinator Name</FormLabel>
              <Input value={editCoordinatorName} onChange={e => setEditCoordinatorName(e.target.value)} />
            </FormControl>
            <FormControl isRequired mb={2}>
              <FormLabel>Coordinator Number</FormLabel>
              <Input value={editCoordinatorNumber} onChange={e => setEditCoordinatorNumber(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleEditSave} isLoading={editLoading}>
              Save
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default ServiceCoordinatorForm;