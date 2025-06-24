import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
} from '@chakra-ui/react';
import Layout from './components/Layout';

const ServiceForm = () => {
  const [name, setName] = useState('');
  const [reportingTime, setReportingTime] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://vrc-server-production.up.railway.app/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, reportingTime }),
      });

      if (!res.ok) throw new Error('Failed to add service');

      const data = await res.json();
      toast({
        title: 'Service added',
        description: `Service "${data.name}" was added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setName('');
      setReportingTime('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Heading mb={6} fontSize="xl">Add New Service</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired mb={4}>
            <FormLabel>Service Name</FormLabel>
            <Input
              placeholder="Enter service name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel>Reporting Time</FormLabel>
            <Input
              type="time"
              value={reportingTime}
              onChange={(e) => setReportingTime(e.target.value)}
            />
          </FormControl>

          <Button colorScheme="teal" type="submit" width="full">
            Add Service
          </Button>
        </form>
      </Box>
    </Layout>
  );
};

export default ServiceForm;
