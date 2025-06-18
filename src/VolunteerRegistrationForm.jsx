"use client"

import { useState } from "react"
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
} from "@chakra-ui/react"
import Layout from "./components/Layout"

const serviceOptions = [
  "decoration",
  "Food Distribution",
  "Transport Assistance",
  "Event Management",
  "Teaching",
  "Tech Support",
]

export default function VolunteerRegistrationForm() {
  const toast = useToast()
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    serviceType: "",
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3300/register-volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to submit volunteer")

      toast({
        title: "Volunteer Registered",
        description: "Volunteer has been successfully registered.",
        status: "success",
        duration: 4000,
        isClosable: true,
      })

      setFormData({ username: "", phone: "", serviceType: "" })
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
              <Input value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Service Type</FormLabel>
              <Select
                placeholder="Select service type"
                value={formData.serviceType}
                onChange={e => handleChange("serviceType", e.target.value)}
              >
                {serviceOptions.map(service => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button colorScheme="blue" width="full" onClick={handleSubmit}>
              Submit
            </Button>
          </VStack>
        </Container>
      </Box>
      </Layout>
    </ChakraProvider>
  )
}
