"use client"

import { useState } from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
  Heading,
  useToast,
} from "@chakra-ui/react"
import Layout from "./components/Layout"
import { useNavigate } from "react-router-dom"

export default function EventForm() {
  const navigate = useNavigate();
  const toast = useToast()
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    venue: "",
    locationLink: "",
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

const handleSubmit = async () => {
  const confirmed = window.confirm("Are you sure you want to create this event?");
  if (!confirmed) return;
   toast({
      title: "Event Submitting",
      description: "Event has been creating wait .",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  try {
    const response = await fetch("https://vrc-server-110406681774.asia-south1.run.app/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Failed to submit event");

    toast({
      title: "Event Submitted",
      description: "Event has been successfully created.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    setFormData({ date: "", time: "", venue: "", locationLink: "" });
  } catch (err) {
    toast({
      title: "Error",
      description: err.message,
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  }
};


  return (
    <ChakraProvider>
      <Layout>
        <Box bg="gray.50" minH="100vh" py={10}>
          <Container maxW="md" bg="white" p={6} borderRadius="md" boxShadow="md">
            <Heading mb={6} fontSize="xl">
              📅 Create MeetUp
            </Heading>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Time</FormLabel>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Venue</FormLabel>
                <Input
                  value={formData.venue}
                  onChange={(e) => handleChange("venue", e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Location Link</FormLabel>
                <Input
                  type="url"
                  value={formData.locationLink}
                  onChange={(e) => handleChange("locationLink", e.target.value)}
                />
              </FormControl>

              <Button colorScheme="teal" width="full" onClick={handleSubmit}>
                Submit
              </Button>
               <Button
                colorScheme="blue"
                variant="outline"
                width="full"
                onClick={() => navigate("/event-list")}
              >
                Go to Event List
              </Button>
            </VStack>
          </Container>
        </Box>
      </Layout>
    </ChakraProvider>
  )
}
