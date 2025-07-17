import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';
import Layout from '../components/Layout';

const ServiceCoordinatorForm = () => {
  const [serviceName, setServiceName] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorNumber, setCoordinatorNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!serviceName.trim() || !coordinatorName.trim() || !coordinatorNumber.trim()) {
      toast({ title: 'Error', description: 'All fields are required', status: 'error', duration: 3000 });
      return;
    }
    setLoading(true);
    try {
      const data = {
        serviceName,
        coordinatorName,
        coordinatorNumber,
      };
      await axios.post('https://vrc-server-110406681774.asia-south1.run.app/servicecoordinator/api/add', data);
      toast({ title: 'Success', description: 'Service and Coordinator added!', status: 'success', duration: 3000 });
      setServiceName('');
      setCoordinatorName('');
      setCoordinatorNumber('');
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
    </Layout>
  );
};

export default ServiceCoordinatorForm;