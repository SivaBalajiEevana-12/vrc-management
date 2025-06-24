// "use client"

import { useState, useEffect } from "react"
import {
  ChakraProvider,
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react"
import Layout from "./components/Layout"

export default function VolunteerRegistrationForm() {
  const toast = useToast()

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    serviceType: "",
    link: "",
    location: "",
    reportingTime: "",
  })

  const [serviceOptions, setServiceOptions] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)

  // Fetch service list
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("https://vrc-server-production.up.railway.app/service")
        if (!res.ok) throw new Error("Failed to fetch services")
        const data = await res.json()
        setServiceOptions(data)
      } catch (err) {
        toast({
          title: "Error loading services",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      } finally {
        setLoadingServices(false)
      }
    }

    fetchServices()
  }, [toast])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://vrc-server-production.up.railway.app/register-volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to register volunteer")

      toast({
        title: "Volunteer Registered",
        description: "Volunteer has been successfully registered.",
        status: "success",
        duration: 4000,
        isClosable: true,
      })

      setFormData({
        username: "",
        phone: "",
        serviceType: "",
        link: "",
        location: "",
        reportingTime: "",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  return (
    <ChakraProvider>
      <Layout>
        <Box bg="gray.50" minH="100vh" py={10}>
          <Container maxW="md" bg="white" p={6} borderRadius="md" boxShadow="md">
            <Heading mb={6} fontSize="xl">
              📝 Volunteer Manager Registration
            </Heading>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input value={formData.username} onChange={e => handleChange("username", e.target.value)} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input type="tel" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
              </FormControl>

              <FormControl isRequired>
  <FormLabel>Service Type</FormLabel>
  <Input
    placeholder="Enter service type"
    value={formData.serviceType}
    onChange={e => handleChange("serviceType", e.target.value)}
  />
</FormControl>

              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input value={formData.location} onChange={e => handleChange("location", e.target.value)} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Location Link</FormLabel>
                <Input
                  type="url"
                  value={formData.link}
                  onChange={e => handleChange("link", e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Reporting Time</FormLabel>
                <Input
                  type="time"
                  value={formData.reportingTime}
                  onChange={e => handleChange("reportingTime", e.target.value)}
                />
              </FormControl>

              <Button colorScheme="teal" width="full" onClick={handleSubmit} isDisabled={loadingServices}>
                Submit
              </Button>
            </VStack>
          </Container>
        </Box>
      </Layout>
    </ChakraProvider>
  )
}
