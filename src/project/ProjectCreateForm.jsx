import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const ProjectCreateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://vrc-server-110406681774.asia-south1.run.app/register/project", formData); // adjust endpoint as needed
      toast({
        title: "Project created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({ name: "", date: "", location: "" });
    } catch (err) {
      toast({
        title: "Error creating project.",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <Heading size="lg" mb={6}>Create Project</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Project Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
            />
          </FormControl>

          <Button colorScheme="teal" type="submit" width="full">
            Create Project
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ProjectCreateForm;
