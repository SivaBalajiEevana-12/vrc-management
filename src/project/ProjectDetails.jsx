import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Badge,
  Spinner,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { MdLocationOn, MdDateRange } from "react-icons/md";
import axios from "axios";
import dayjs from "dayjs";
import Layout from "../components/Layout";

const ProjectDetails = () => {
  const { id } = useParams(); // get project ID from route
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3300/register/project/${id}`
        );
        setProject(res.data);
      } catch (err) {
        console.error("Failed to fetch project details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <Box p={6}>
        <Spinner size="xl" />
        <Text mt={4}>Loading project details...</Text>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box p={6}>
        <Text>Project not found.</Text>
      </Box>
    );
  }

  return (
    <Layout>
    <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <Heading mb={4}>{project.name}</Heading>

      <Stack spacing={3}>
        {project.date && (
          <Text fontSize="md">
            <Icon as={MdDateRange} mr={2} color="gray.500" />
            <Badge colorScheme="green" fontSize="0.9em">
              {dayjs(project.date).format("MMMM D, YYYY")}
            </Badge>
          </Text>
        )}

        {project.location && (
          <Text fontSize="md">
            <Icon as={MdLocationOn} mr={2} color="gray.500" />
            {project.location}
          </Text>
        )}
      </Stack>
    </Box>
    </Layout>
  );
};

export default ProjectDetails;
