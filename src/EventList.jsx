"use client"

import { useEffect, useState } from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  useToast,
  Spinner,
  HStack,
} from "@chakra-ui/react"
import Layout from "./components/Layout"

export default function EventsList() {
  const toast = useToast()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://vrc-server-110406681774.asia-south1.run.app/events")
      const data = await res.json()
      setEvents(data)
      setLoading(false)
    } catch (err) {
      toast({
        title: "Error loading events",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?")
    if (!confirmed) return

    try {
      const res = await fetch(`https://vrc-server-110406681774.asia-south1.run.app/events/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete event")

      toast({
        title: "Event deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      fetchEvents()
    } catch (err) {
      toast({
        title: "Error deleting event",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <ChakraProvider>
      <Layout>
        <Container maxW="4xl" py={8}>
          <Heading mb={6}>📅 Upcoming Events</Heading>

          {loading ? (
            <Spinner size="lg" />
          ) : events.length === 0 ? (
            <Text>No events found.</Text>
          ) : (
            <VStack spacing={5} align="stretch">
              {events.map((event) => (
                <Box
                  key={event._id}
                  p={4}
                  bg="gray.50"
                  border="1px solid #e2e8f0"
                  borderRadius="md"
                  boxShadow="sm"
                >
                  <Text fontWeight="bold">📍 Venue: {event.venue}</Text>
                  <Text>📅 Date: {event.dateDisplay}</Text>
                  <Text>🕓 Time: {event.timeDisplay}</Text>
                  <Text color="blue.500" isTruncated>
                    <a href={event.locationLink} target="_blank" rel="noopener noreferrer">
                      📌 Location Link
                    </a>
                  </Text>
                  <HStack justify="end" mt={3}>
                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(event._id)}>
                      Delete
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Container>
      </Layout>
    </ChakraProvider>
  )
}
