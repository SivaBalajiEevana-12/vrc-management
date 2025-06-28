import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Spinner,
  Text,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3300/register/projects");
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Box p={6}>
        <Spinner size="xl" />
        <Text mt={4}>Loading projects...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Projects</Heading>

      {projects.length === 0 ? (
        <Text>No projects available.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {projects.map((project) => (
            <Box
              key={project._id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              _hover={{ shadow: "md", bg: "gray.50" }}
              onClick={() => navigate(`/project/${project._id}`)}
              cursor="pointer"
            >
              <HStack justify="space-between" mb={1}>
                <Text fontWeight="bold" fontSize="lg">
                  {project.name}
                </Text>
                {project.date && (
                  <Badge colorScheme="teal">
                    {dayjs(project.date).format("MMM D, YYYY")}
                  </Badge>
                )}
              </HStack>
              {project.location && (
                <Text fontSize="sm" color="gray.600">
                  📍 {project.location}
                </Text>
              )}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ProjectList;
