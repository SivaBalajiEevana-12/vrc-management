import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useToast,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Layout from './components/Layout';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const res = await fetch('https://vrc-server-production.up.railway.app/service');
      const data = await res.json();
      setServices(data);
      console.log('Fetched services:', data); 
      setLoading(false);
    } catch (err) {
      toast({
        title: 'Error loading services',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const deleteService = async (id) => {
    try {
      const res = await fetch(`https://vrc-server-production.up.railway.app/service/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      setServices((prev) => prev.filter((s) => s._id !== id));
      toast({
        title: 'Service deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error deleting service',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <Box maxW="lg" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg" boxShadow="md">
        <Heading mb={4}>Service List</Heading>

        <Button colorScheme="teal" mb={6} onClick={() => navigate('/post-service')}>
          Add New Service
        </Button>

        {loading ? (
          <Spinner />
        ) : services.length === 0 ? (
          <Text>No services found.</Text>
        ) : (
          <Stack spacing={4}>
            {services.map((service) => (
              <Box
                key={service._id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="sm"
                bg="gray.50"
              >
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold">{service.name}</Text>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => deleteService(service._id)}
                  >
                    Delete
                  </Button>
                </HStack>

                {service.reportingTime && (
                  <Text fontSize="sm" color="gray.600">
                    🕒 Report Time: {service.reportingTime.replace(/(AM|PM)/, ' $1')}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Layout>
  );
};

export default ServiceList;
