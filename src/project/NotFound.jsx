import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFound= () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={16} px={6}>
      <Heading
        display="inline-block"
        as="h1"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you’re looking for does not seem to exist.
      </Text>
      <Button
        colorScheme="teal"
        onClick={() => navigate("/")}
        variant="solid"
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;