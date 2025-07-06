import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Container,
  Spinner,
  Text
} from '@chakra-ui/react';
import axios from 'axios';
import Layout from './components/Layout';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://vrc-server-110406681774.asia-south1.run.app/flcattendence1');
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
    <Container maxW="container.md" py={8}>
      <Heading mb={6} textAlign="center">Present Users</Heading>

      {loading ? (
        <Box textAlign="center" py={10}>
          <Spinner size="xl" />
        </Box>
      ) : error ? (
        <Text color="red.500" textAlign="center">{error}</Text>
      ) : (
        <Box overflowX="auto" borderWidth="1px" rounded="lg" shadow="sm">
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Organization</Th>
                <Th>Location</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user._id}>
                  <Td>{user.name}</Td>
                  <Td>{user.whatsappNumber}</Td>
                  <Td>{user.organization}</Td>
                  <Td>{user.location}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Container>
    </Layout>
  );
};

export default UserTable;
