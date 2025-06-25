import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Heading,
  Badge,
} from "@chakra-ui/react";
import Layout from "./components/Layout";

const Siva = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://vrc-server-production.up.railway.app/api/attendance")
      .then((res) => res.json())
      .then((data) => {
        setAttendanceData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
    <Box p={6} maxW="100%" overflowX="auto">
      <Heading mb={6} size="lg" textAlign="center">
        Volunteer Attendance Records
      </Heading>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Table variant="simple" size="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>Name</Th>
              <Th>WhatsApp</Th>
              <Th>Service Type</Th>
              <Th>Status</Th>
              <Th>Verified</Th>
            </Tr>
          </Thead>
          <Tbody>
            {attendanceData.map((entry) => (
              <Tr key={entry._id}>
                <Td>{entry.volunteer?.name || "N/A"}</Td>
                <Td>{entry.volunteer?.whatsappNumber || "N/A"}</Td>
                <Td>{entry.volunteer?.serviceType || "N/A"}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      entry.status === "Present"
                        ? "green"
                        : entry.status === "Absent"
                        ? "red"
                        : "gray"
                    }
                  >
                    {entry.status}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={entry.verified ? "green" : "red"}>
                    {entry.verified ? "Yes" : "No"}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
    </Layout>
  );
};

export default Siva;
