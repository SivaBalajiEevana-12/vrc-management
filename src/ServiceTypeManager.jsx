"use client"

import { useEffect, useState } from "react"
import {
  Box,
  ChakraProvider,
  Container,
  Heading,
  Select,
  Text,
  VStack,
  HStack,
  Spinner,
  useToast,
  Divider,
} from "@chakra-ui/react"
import Layout from "./components/Layout"

const ServiceTypeManager = () => {
  const [volunteers, setVolunteers] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("https://vrc-server-production.up.railway.app") // Adjust endpoint if needed
      const data = await res.json()
      setVolunteers(data)
    } catch (error) {
      console.error("Failed to fetch volunteers:", error)
      toast({
        title: "Fetch Error",
        description: "Could not load volunteer data.",
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const fetchServices = async () => {
    try {
      const res = await fetch("https://vrc-server-production.up.railway.app/service") // Replace with your actual endpoint
      const data = await res.json()
      setServiceOptions(data)
    } catch (error) {
      console.error("Failed to fetch services:", error)
      toast({
        title: "Fetch Error",
        description: "Could not load service types.",
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const handleServiceTypeChange = async (id, newType) => {
    try {
      await fetch(`https://vrc-server-production.up.railway.app/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType: newType }),
      })

      toast({
        title: "Updated",
        description: "Service type updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      setVolunteers((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, serviceType: newType } : v
        )
      )
    } catch (error) {
      console.error("Update failed:", error)
      toast({
        title: "Update Error",
        description: "Could not update service type.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchVolunteers(), fetchServices()])
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <ChakraProvider>
        <Layout>
          <Container centerContent py={10}>
            <Spinner size="xl" />
          </Container>
        </Layout>
      </ChakraProvider>
    )
  }

  return (
    <ChakraProvider>
      <Layout>
        <Box bg="gray.50" minH="100vh" py={8}>
          <Container maxW="2xl">
            <Heading size="lg" mb={6} color="orange.500">
              Volunteer Service Type Assignment
            </Heading>

            <VStack spacing={6} align="stretch">
              {volunteers.map((volunteer) => (
                <Box
                  key={volunteer._id}
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="white"
                >
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold">{volunteer.name}</Text>
                    <Text fontSize="sm">WhatsApp: {volunteer.whatsappNumber}</Text>
                    <Text fontSize="sm">Locality: {volunteer.currentLocality}</Text>
                    <Text fontSize="sm">Service Availability: {volunteer.serviceAvailability}</Text>

                    <Divider />

                    <HStack width="100%">
                      <Text fontSize="sm" minW="120px">
                        Service Type:
                      </Text>
                      <Select
                        placeholder="Select service type"
                        value={volunteer.serviceType}
                        onChange={(e) =>
                          handleServiceTypeChange(volunteer._id, e.target.value)
                        }
                      >
                        {serviceOptions.map((service) => (
                          <option key={service._id} value={service.name}>
                            {service.name}
                          </option>
                        ))}
                      </Select>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Container>
        </Box>
      </Layout>
    </ChakraProvider>
  )
}

export default ServiceTypeManager
