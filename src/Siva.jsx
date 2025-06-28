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
  Input,
  Select,
  Flex,
} from "@chakra-ui/react";
import Layout from "./components/Layout";
import { useNavigate } from "react-router-dom";

const Siva = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [serviceCounts, setServiceCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://vrc-server-110406681774.asia-south1.run.app/api/attendance")
      .then((res) => res.json())
      .then((data) => {
        setAttendanceData(data);
        setFilteredData(data);
        countServiceTypes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setLoading(false);
      });
  }, []);

  const countServiceTypes = (data) => {
    const counts = {};
    data.forEach((entry) => {
      const type = entry.volunteer?.serviceType || "N/A";
      counts[type] = (counts[type] || 0) + 1;
    });
    setServiceCounts(counts);
  };

  useEffect(() => {
    let updatedData = [...attendanceData];

    if (serviceFilter !== "All") {
      updatedData = updatedData.filter(
        (entry) =>
          (entry.volunteer?.serviceType || "N/A") === serviceFilter
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      updatedData = updatedData.filter((entry) => {
        const name = entry.volunteer?.name?.toLowerCase() || "";
        const whatsapp = entry.volunteer?.whatsappNumber?.toLowerCase() || "";
        const serviceType =
          entry.volunteer?.serviceType?.toLowerCase() || "";
        return (
          name.includes(term) ||
          whatsapp.includes(term) ||
          serviceType.includes(term)
        );
      });
    }

    setFilteredData(updatedData);
  }, [searchTerm, serviceFilter, attendanceData]);

  const uniqueServiceTypes = Array.from(
    new Set(
      attendanceData.map((entry) => entry.volunteer?.serviceType || "N/A")
    )
  );

  return (
    <Layout>
      <Box p={6} maxW="100%" overflowX="auto">
        <Heading mb={6} size="lg" textAlign="center">
          Volunteer Attendance Records
        </Heading>

        {loading ? (
          <Spinner size="xl" />
        ) : (
          <>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="center"
              mb={4}
              gap={4}
            >
              <Input
                placeholder="Search by Name, WhatsApp, or Service Type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                maxW="300px"
              />

              <Select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                maxW="250px"
              >
                <option value="All">All Service Types</option>
                {uniqueServiceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Flex>

            <Box mb={4} fontWeight="semibold">
              Total Attendance Records: {filteredData.length}
            </Box>

            <Box mb={4}>
              <Heading size="sm" mb={2}>
                Service Type Counts:
              </Heading>
              <Flex wrap="wrap" gap={4}>
                {Object.entries(serviceCounts).map(([type, count]) => (
                  <Badge key={type} colorScheme="blue" p={2} borderRadius="md">
                    {type}: {count}
                  </Badge>
                ))}
              </Flex>
            </Box>

            <Table variant="simple" size="md">
              <Thead bg="gray.100">
                <Tr>
                  <Th>Name</Th>
                  <Th>WhatsApp</Th>
                  <Th>Service Type</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredData.map((entry) => (
                  <Tr key={entry._id}>
                    <Td
                      color="teal.600"
                      fontWeight="bold"
                      cursor="pointer"
                      onClick={() =>
                        navigate(`/service/${entry.volunteer?._id}`)
                      }
                    >
                      {entry.volunteer?.name || "N/A"}
                    </Td>
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
                        {entry.status || "N/A"}
                      </Badge>
                    </Td>
                    <Td>
                      {entry.date
                        ? new Date(entry.date).toLocaleDateString()
                        : "N/A"}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default Siva;
