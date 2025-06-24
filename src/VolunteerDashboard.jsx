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
  Button,
  IconButton,
  useToast
} from "@chakra-ui/react"
import { Search, Phone, Trash2 } from "lucide-react"
import Layout from "./components/Layout"

export default function VolunteerDashboard() {
  const [volunteersData, setVolunteersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchPhone, setSearchPhone] = useState("")
  const [filterServiceType, setFilterServiceType] = useState("")
  const [sortDirection, setSortDirection] = useState("desc")
  const toast = useToast()

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://vrc-server-production.up.railway.app")

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        setVolunteersData(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVolunteers()
  }, [])

  const serviceTypes = useMemo(() => {
    const types = volunteersData.map((v) => v.serviceType).filter((type) => type && type.trim() !== "")
    return [...new Set(types)]
  }, [volunteersData])

  const filteredVolunteers = useMemo(() => {
    const counts = {}
    for (const v of volunteersData) {
      const type = v.serviceType || "Unknown"
      counts[type] = (counts[type] || 0) + 1
    }

    const sorted = [...volunteersData].sort((a, b) => {
      const countA = counts[a.serviceType || "Unknown"]
      const countB = counts[b.serviceType || "Unknown"]
      return sortDirection === "asc" ? countA - countB : countB - countA
    })

    return sorted.filter((v) => {
      const phoneMatch = v.whatsappNumber.includes(searchPhone)
      const serviceMatch = filterServiceType === "" || v.serviceType === filterServiceType
      return phoneMatch && serviceMatch
    })
  }, [volunteersData, searchPhone, filterServiceType, sortDirection])

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this volunteer?")
    if (!confirm) return

    try {
      const res = await fetch(`https://vrc-server-production.up.railway.app/user/${id}`, {
        method: "DELETE"
      })

      if (!res.ok) throw new Error("Failed to delete user")

      setVolunteersData((prev) => prev.filter((v) => v._id !== id))
      toast({ title: "Deleted", description: "Volunteer removed", status: "success", duration: 3000 })
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: err.message, status: "error", duration: 3000 })
    }
  }

  if (loading) {
    return (
      <Layout>
        <Container maxW="7xl" py={8}>
          <VStack spacing={6}>
            <Heading size="xl" color="teal.600">Volunteer Management Dashboard</Heading>
            <Spinner size="xl" color="teal.500" />
            <Text>Loading volunteers...</Text>
          </VStack>
        </Container>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Container maxW="7xl" py={8}>
          <VStack spacing={6}>
            <Heading size="xl" color="teal.600">Volunteer Management Dashboard</Heading>
            <Alert status="error">
              <AlertIcon />
              <Box>
                <AlertTitle>Error loading data!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
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

            <Button
              variant="outline"
              colorScheme="teal"
              onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
            >
              Sort by Service Count: {sortDirection === "asc" ? "Ascending" : "Descending"}
            </Button>

            <Spacer />
            <Text fontSize="sm" color="gray.600" alignSelf="center">
              Showing {filteredVolunteers.length} of {volunteersData.length} volunteers
            </Text>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredVolunteers.map((volunteer) => (
              <Card key={volunteer._id} shadow="md" borderWidth="1px" borderColor="gray.200">
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Flex w="full" justify="space-between" align="center">
                      <Heading size="md" color="teal.700">
                        {volunteer.name}
                      </Heading>
                      <HStack>
                        <Badge colorScheme={volunteer.previousVolunteer === "yes" ? "green" : "gray"}>
                          {volunteer.previousVolunteer === "yes" ? "Experienced" : "New"}
                        </Badge>
                        <IconButton
                          icon={<Trash2 size={16} />}
                          colorScheme="red"
                          size="sm"
                          aria-label="Delete"
                          onClick={() => handleDelete(volunteer._id)}
                        />
                      </HStack>
                    </Flex>

                    <HStack>
                      <Phone size={16} color="gray" />
                      <Text fontSize="sm" color="gray.600">
                        {volunteer.whatsappNumber}
                      </Text>
                    </HStack>

                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm"><b>Age:</b> {volunteer.age}</Text>
                      <Text fontSize="sm"><b>Gender:</b> {volunteer.gender}</Text>
                      <Text fontSize="sm"><b>Location:</b> {volunteer.currentLocality}</Text>
                      <Text fontSize="sm"><b>College/Company:</b> {volunteer.collegeCompany}</Text>
                      <Text fontSize="sm"><b>Availability:</b> {volunteer.serviceAvailability}</Text>
                      {volunteer.serviceType && (
                        <Text fontSize="sm">
                          <b>Service Type:</b>{" "}
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

          <Button
            colorScheme="teal"
            alignSelf="center"
            mt={4}
            onClick={async () => {
              try {
                const res = await fetch("https://vrc-server-production.up.railway.app/send-notification", {
                  method: "POST"
                })
                if (!res.ok) throw new Error("Failed to send notifications")
                alert("Messages sent successfully to all volunteers.")
              } catch (err) {
                alert("Error sending messages: " + err.message)
              }
            }}
          >
            Send Message to All Volunteers
          </Button>
        </VStack>
      </Container>
    </Layout>
  )
}
