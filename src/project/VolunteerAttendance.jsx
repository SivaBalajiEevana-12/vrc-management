import React, { useState } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  Avatar,
  VStack,
  HStack,
  Divider,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { FaOm } from "react-icons/fa";

const KRISHNA_QUOTE =
  "“Chant Hare Krishna and be happy.” – Srila Prabhupada";

function getTodayDateString() {
  const options = { month: "long", day: "numeric" };
  return new Date().toLocaleDateString("en-US", options);
}

const VolunteerAttendance = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const todayDate = getTodayDateString();

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    setVolunteer(null);
    try {
      const res = await fetch(
        `https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers/${whatsappNumber}`
      );
      if (!res.ok) throw new Error("Volunteer not found");
      const data = await res.json();
      setVolunteer(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleMarkAttendance = async () => {
    if (!volunteer) return;
    setAttendanceLoading(true);
    setError("");
    try {
      const res = await fetch("https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappNumber: volunteer.whatsappNumber,
          date: todayDate,
          serviceType: volunteer.assignedService?.serviceName || "General",
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Attendance error");
      setAttendanceMarked(true);
      setVolunteer(result.volunteer);
      toast({
        title: "Attendance marked!",
        description: `Attendance for ${todayDate} has been marked.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.message);
    }
    setAttendanceLoading(false);
  };

  const alreadyAttended =
    volunteer?.attendance?.some(
      (a) =>
        a.date === todayDate &&
        (a.serviceType === (volunteer.assignedService?.serviceName || "General")) &&
        a.attended
    ) || attendanceMarked;

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, orange.100, purple.50)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={{ base: 3, md: 6 }}
      px={{ base: 2, md: 0 }}
    >
      <VStack spacing={6} w="100%">
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color="purple.700"
          textAlign="center"
          lineHeight={{ base: "1.1", md: "1.2" }}
        >
          <HStack justify="center">
            <FaOm size={28} color="#4e148c" />
            <span>Volunteer Daily Attendance Pass</span>
          </HStack>
        </Text>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="green.700"
          textAlign="center"
          px={{ base: 2, md: 0 }}
        >
          {KRISHNA_QUOTE}
        </Text>
        <HStack spacing={3} w={{ base: "100%", sm: "auto" }}>
          <Input
            placeholder="Enter WhatsApp Number"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            width={{ base: "100%", sm: "220px" }}
            fontSize={{ base: "sm", md: "md" }}
          />
          <Button
            colorScheme="purple"
            onClick={handleFetch}
            isLoading={loading}
            disabled={!whatsappNumber}
            height={{ base: "38px", md: "40px" }}
            borderRadius="md"
            fontSize={{ base: "sm", md: "md" }}
            px={{ base: 4, md: 6 }}
          >
            Fetch My ID
          </Button>
        </HStack>
        {error && (
          <Alert status="error" rounded="md" width="100%">
            <AlertIcon />
            {error}
          </Alert>
        )}
        {volunteer && (
          <Card
            bg="whiteAlpha.900"
            boxShadow="2xl"
            borderRadius="2xl"
            minW={{ base: "0", md: "350px" }}
            maxW={{ base: "100%", sm: "380px", md: "420px" }}
            mx="auto"
            my={{ base: 2, md: 0 }}
            p={0}
            w={{ base: "100%", sm: "380px", md: "420px" }}
          >
            <CardHeader
              bgGradient="linear(to-r, orange.200, purple.100)"
              borderTopRadius="2xl"
              position="relative"
              height={{ base: "92px", md: "100px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <FaOm size={34} color="#4e148c" />
              <Avatar
                mt={-14}
                size="xl"
                src={volunteer.imageUrl}
                name={volunteer.name}
                border="4px solid white"
                boxShadow="md"
                position="absolute"
                left="50%"
                top={{ base: "76px", md: "84px" }}
                transform="translateX(-50%)"
              />
            </CardHeader>
            <CardBody pt={16} pb={4}>
              <VStack spacing={2} align="center">
                <Heading
                  size="md"
                  color="purple.700"
                  fontWeight="bold"
                  fontSize={{ base: "lg", md: "xl" }}
                  textAlign="center"
                >
                  {volunteer.name}
                  <Badge ml={2} colorScheme="green" fontSize={{ base: "0.8em", md: "1em" }}>
                    Verified
                  </Badge>
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.700">
                  WhatsApp: <b>{volunteer.whatsappNumber}</b>
                </Text>
                <Badge fontSize={{ base: "0.8em", md: "1em" }} colorScheme="blue">
                  {volunteer.profession}
                </Badge>
                {volunteer.collegeOrCompany && (
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                    {volunteer.collegeOrCompany}
                  </Text>
                )}
                <Badge
                  colorScheme={volunteer.gender === "Male" ? "purple" : "pink"}
                  fontSize={{ base: "0.8em", md: "1em" }}
                >
                  {volunteer.gender}
                </Badge>
                <Text fontSize={{ base: "xs", md: "sm" }} color="purple.600">
                  Age: {volunteer.age} | DOB: {new Date(volunteer.dateOfBirth).toLocaleDateString()}
                </Text>
                {volunteer.locality && (
                  <Text fontSize={{ base: "xs", md: "sm" }} color="orange.700">
                    Locality: {volunteer.locality}
                  </Text>
                )}
                {volunteer.assignedService && (
                  <Badge
                    colorScheme="orange"
                    fontSize={{ base: "0.9em", md: "1em" }}
                    px={4}
                    py={2}
                    mt={2}
                    borderRadius="md"
                  >
                    Service: {volunteer.assignedService.serviceName || "Volunteer"}
                  </Badge>
                )}
                <Divider my={3} />
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="green.700"
                  fontWeight="semibold"
                  textAlign="center"
                >
                  Attendance for Today:
                </Text>
                <Badge
                  colorScheme="purple"
                  fontSize={{ base: "0.95em", md: "1em" }}
                  px={4}
                  py={2}
                  mt={1}
                  borderRadius="md"
                >
                  {todayDate}
                </Badge>
                <Divider my={2} />
                <Button
                  leftIcon={alreadyAttended ? <CheckCircleIcon /> : <FaOm />}
                  colorScheme={alreadyAttended ? "green" : "purple"}
                  variant={alreadyAttended ? "outline" : "solid"}
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                  borderRadius="lg"
                  isLoading={attendanceLoading}
                  isDisabled={alreadyAttended}
                  minW={{ base: "140px", md: "180px" }}
                  onClick={handleMarkAttendance}
                  mb={1}
                >
                  {alreadyAttended ? "Attendance Marked" : "Mark Attendance"}
                </Button>
                {volunteer.attendance && volunteer.attendance.length > 0 && (
                  <Box w="100%" mt={2}>
                    <Divider />
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      color="purple.700"
                      mt={2}
                      fontWeight="semibold"
                      textAlign="center"
                    >
                      My Attendance Record
                    </Text>
                    <SimpleGrid columns={1} spacing={2} mt={1}>
                      {volunteer.attendance.map((a, i) => (
                        <Badge
                          key={i}
                          colorScheme={a.attended ? "green" : "gray"}
                          fontSize={{ base: "0.85em", md: "0.95em" }}
                          px={2}
                          py={1}
                          borderRadius="md"
                          textAlign={"center"}
                        >
                          {a.date} - {a.serviceType || "General"}:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {a.attended ? "Present" : "Absent"}
                          </span>
                        </Badge>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}
                <Divider mt={2} />
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.500"
                  fontStyle="italic"
                  textAlign="center"
                  mt={2}
                >
                  "Serving Krishna is the greatest fortune. Thank you, dear volunteer!"
                </Text>
              </VStack>
            </CardBody>
            <CardFooter
              bgGradient="linear(to-r, orange.100, purple.50)"
              borderBottomRadius="2xl"
              justify="center"
            >
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="purple.600"
                textAlign="center"
              >
                Hare Krishna Movement  Volunteer ID &mdash; Jai Sri Krishna!
              </Text>
            </CardFooter>
          </Card>
        )}
      </VStack>
    </Box>
  );
};

export default VolunteerAttendance;