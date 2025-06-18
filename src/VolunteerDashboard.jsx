"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Box,
  Container,
  Heading,
  Input,
  Select,
  VStack,
  HStack,
  Card,
  CardBody,
  Text,
  Badge,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Flex,
  Spacer,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button
} from "@chakra-ui/react"
import { Search, Phone } from "lucide-react"
import Layout from "./components/Layout"

export default function VolunteerDashboard() {
  const [volunteersData, setVolunteersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchPhone, setSearchPhone] = useState("")
  const [filterServiceType, setFilterServiceType] = useState("")

  // Fetch data from API
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://vrc-server-production.up.railway.app")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setVolunteersData(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching volunteers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVolunteers()
  }, [])

  // Get unique service types for filter dropdown
  const serviceTypes = useMemo(() => {
    const types = volunteersData.map((volunteer) => volunteer.serviceType).filter((type) => type && type.trim() !== "")
    return [...new Set(types)]
  }, [volunteersData])

  // Filter volunteers based on search and filter criteria
  const filteredVolunteers = useMemo(() => {
    return volunteersData.filter((volunteer) => {
      const phoneMatch = volunteer.whatsappNumber.includes(searchPhone)
      const serviceMatch = filterServiceType === "" || volunteer.serviceType === filterServiceType
      return phoneMatch && serviceMatch
    })
  }, [volunteersData, searchPhone, filterServiceType])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Loading state
  if (loading) {
    return (
        <Layout>
      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="center">
          <Heading size="xl" textAlign="center" color="teal.600">
            Volunteer Management Dashboard
          </Heading>
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <Text>Loading volunteers...</Text>
        </VStack>
      </Container>
      </Layout>
    )
  }

  // Error state
  if (error) {
    return (
        <Layout>
      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading size="xl" textAlign="center" color="teal.600">
            Volunteer Management Dashboard
          </Heading>
          <Alert status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>Error loading data!</AlertTitle>
              <AlertDescription>
                Failed to fetch volunteers from https://vrc-server-production.up.railway.app
                <br />
                Error: {error}
              </AlertDescription>
            </Box>
          </Alert>
        </VStack>
      </Container>
      </Layout>
    )
  }

  return (
    <Layout>
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="xl" textAlign="center" color="teal.600">
          Volunteer Management Dashboard
        </Heading>

        {/* Search and Filter Controls */}
        <Flex gap={4} flexWrap="wrap">
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <Search size={20} color="gray" />
            </InputLeftElement>
            <Input
              placeholder="Search by phone number..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              bg="white"
              borderColor="gray.300"
            />
          </InputGroup>

          <Select
            placeholder="Filter by service type"
            value={filterServiceType}
            onChange={(e) => setFilterServiceType(e.target.value)}
            maxW="250px"
            bg="white"
            borderColor="gray.300"
          >
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Spacer />

          <Text fontSize="sm" color="gray.600" alignSelf="center">
            Showing {filteredVolunteers.length} of {volunteersData.length} volunteers
          </Text>
        </Flex>

        {/* Volunteers Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredVolunteers.map((volunteer) => (
            <Card key={volunteer._id} shadow="md" borderWidth="1px" borderColor="gray.200">
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Flex w="full" justify="space-between" align="center">
                    <Heading size="md" color="teal.700">
                      {volunteer.name}
                    </Heading>
                    <Badge colorScheme={volunteer.previousVolunteer === "yes" ? "green" : "gray"} variant="subtle">
                      {volunteer.previousVolunteer === "yes" ? "Experienced" : "New"}
                    </Badge>
                  </Flex>

                  <HStack>
                    <Phone size={16} color="gray" />
                    <Text fontSize="sm" color="gray.600">
                      {volunteer.whatsappNumber}
                    </Text>
                  </HStack>

                  <VStack align="start" spacing={1} w="full">
                    <Text fontSize="sm">
                      <Text as="span" fontWeight="semibold">
                        Age:
                      </Text>{" "}
                      {volunteer.age}
                    </Text>
                    <Text fontSize="sm">
                      <Text as="span" fontWeight="semibold">
                        Gender:
                      </Text>{" "}
                      {volunteer.gender}
                    </Text>
                    <Text fontSize="sm">
                      <Text as="span" fontWeight="semibold">
                        Location:
                      </Text>{" "}
                      {volunteer.currentLocality}
                    </Text>
                    <Text fontSize="sm">
                      <Text as="span" fontWeight="semibold">
                        College/Company:
                      </Text>{" "}
                      {volunteer.collegeCompany}
                    </Text>
                    <Text fontSize="sm">
                      <Text as="span" fontWeight="semibold">
                        Availability:
                      </Text>{" "}
                      {volunteer.serviceAvailability}
                    </Text>
                    {volunteer.serviceType && (
                      <Text fontSize="sm">
                        <Text as="span" fontWeight="semibold">
                          Service Type:
                        </Text>{" "}
                        <Badge colorScheme="blue" variant="subtle">
                          {volunteer.serviceType}
                        </Badge>
                      </Text>
                    )}
                  </VStack>

                  <Text fontSize="xs" color="gray.500">
                    Submitted: {formatDate(volunteer.submittedAt)}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {filteredVolunteers.length === 0 && volunteersData.length > 0 && (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">
              No volunteers found matching your criteria.
            </Text>
          </Box>
        )}

        {volunteersData.length === 0 && !loading && (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">
              No volunteers data available.
            </Text>
          </Box>
        )}
      </VStack>
      <Button
  colorScheme="teal"
  alignSelf="center"
  mt={4}
  onClick={async () => {
    try {
      const res = await fetch("https://vrc-server-production.up.railway.app/send-notification", {
        method: "POST",
      })

      if (!res.ok) throw new Error("Failed to send notifications")

      alert("Messages sent successfully to all volunteers.")
    } catch (err) {
      console.error(err)
      alert("Error sending messages: " + err.message)
    }
  }}
>
  Send Message to All Volunteers
</Button>

    </Container>
    </Layout>
  )
}
