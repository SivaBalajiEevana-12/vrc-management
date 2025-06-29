import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Box,
  Alert,
  AlertIcon,
  Container,
  Heading,
} from "@chakra-ui/react";
import Layout from "./components/Layout";

export default function StatusUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://vrc-server-110406681774.asia-south1.run.app/usersdata");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const filtered = data.filter((user) => user.status !== null);
        setUsers(filtered);
      } catch (err) {
        setError("Error fetching users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return (
<Layout>
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
      </Layout>
    );

  if (error)
    return (
<Layout>
      <Alert status="error" mt={6}>
        <AlertIcon />
        {error}
      </Alert>
      </Layout>
    );

  if (users.length === 0)
    return (
<Layout>
      <Box textAlign="center" py={10} color="gray.500">
        No users with status available.
      </Box>
      </Layout>
    );

  return (
    <Layout>
    <Container maxW="container.lg" py={3}>
      <Heading as="h2" size="lg" mb={4}>
        Users with Status (Excel-style)
      </Heading>
      <TableContainer border="1px solid" borderColor="gray.200" borderRadius="md">
        <Table variant="simple" size="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user._id}>
                <Td>{user._id}</Td>
                <Td>{user.name}</Td>
                <Td>{user.phone}</Td>
                <Td color="blue.600" fontWeight="medium">
                  {user.status}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
    </Layout>
  );
}
