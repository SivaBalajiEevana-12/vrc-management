"use client"

import { useState } from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Container,
  Heading,
  useToast,
} from "@chakra-ui/react"
import Layout from "./components/Layout"

export default function MinimalMeetupForm1() {
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    message: "",
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3300/meetup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to submit form")

      toast({
        title: "Meetup Submitted",
        description: "Training meetup information has been successfully sent.",
        status: "success",
        duration: 4000,
        isClosable: true,
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
            📍 Training Meetup Form
          </Heading>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name </FormLabel>
              <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Location </FormLabel>
              <Input value={formData.location} onChange={(e) => handleChange("location", e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date </FormLabel>
              <Input type="date" value={formData.date} onChange={(e) => handleChange("date", e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Time </FormLabel>
              <Input type="time" value={formData.time} onChange={(e) => handleChange("time", e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Message / Notes </FormLabel>
              <Textarea value={formData.message} onChange={(e) => handleChange("message", e.target.value)} />
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
