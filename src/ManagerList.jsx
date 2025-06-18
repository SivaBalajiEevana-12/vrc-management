"use client"

import { useEffect, useState } from "react"
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
} from "@chakra-ui/react"
import Layout from "./components/Layout"
// import { Layout } from "lucide-react"

export default function ManagerList() {
  const [managers, setManagers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch("https://vrc-server-production.up.railway.app/manager")
        if (!res.ok) {
          throw new Error("Failed to fetch manager data")
        }
        const data = await res.json()
        setManagers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchManagers()
  }, [])

  return (
    <ChakraProvider>
        <Layout>
      <Box bg="gray.50" minH="100vh" py={10}>
        <Container maxW="lg">
          <Heading mb={6} fontSize="2xl" textAlign="center">
            📋 Event Managers
          </Heading>

          {loading && <Spinner size="xl" />}
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          <VStack spacing={4}>
            {managers.map(manager => (
              <Card key={manager._id} width="100%" boxShadow="md">
                <CardBody>
                  <Text fontWeight="bold">👤 {manager.username}</Text>
                  <Text>📞 Phone: {manager.phone}</Text>
                  <Text>🛠️ Service Type: {manager.serviceType}</Text>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Container>
      </Box>
      </Layout>
    </ChakraProvider>
  )
}
