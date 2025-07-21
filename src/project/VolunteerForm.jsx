import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  Input,
  Select,
  Text,
  Heading,
  Button,
  Stack,
  RadioGroup,
  Radio,
  useToast,
  FormControl,
  FormLabel,
  SimpleGrid,
  Spinner,
  Image,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';
import Webcam from 'react-webcam';
import banner from "../assets/banner.jpeg";

const devotees = [
  { name: 'Sitanatha Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Rama Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Gauranga Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'mani teja prabhu', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Not associated', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Niskinchana Bhakta Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Yaduraja Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Vaikunteswara Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Ambarisha Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Sruthisagar Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Shyam Mashav Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Jitaamitra Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Keshav Kripa Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Gopeswara Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Adhokshaja Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Ranveer Rama Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Gadadhara Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Shadgoswami Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Ishan Krishna Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Others', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
];

const dates = ["August 14", "August 15", "August 16", "August 17"];
const timeSlots = [
  { label: "9am to 9pm (Full Day)", value: "Full Day" },
  { label: "2pm to 9pm (Half Day)", value: "Half Day 2pm" },
  { label: "4pm to 9pm(Half Day)", value: "Half Day 4pm" },
  { label: "Not Possible this day", value: "Not Possible " }
];

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    maritalStatus: '',
    profession: '',
    collegeOrCompany: '',
    location: '',
    contactPerson: '',
    infoSource: '',
    serviceAvailability: [],
    tShirtSize: '',
    needAccommodation: ''
  });

  const [image, setImage] = useState(null); 
  const [imageFile, setImageFile] = useState(null); 
  const webcamRef = useRef(null);

  const [loading, setLoading] = useState(false); 
  const toast = useToast();

  const isYoungBoy = Number(formData.age) > 0 && Number(formData.age) < 30 && formData.gender === 'Male';
  const isFullDayVolunteer = formData.serviceAvailability.some((entry) => entry.timeSlot === 'Full Day');
  // Show t-shirt selection for ALL full day volunteers (male or female)
  const showTshirtSelection = isFullDayVolunteer;
  // Accommodation logic: only for young boys who are full day volunteers
  const showAccommodationSelection = isYoungBoy && isFullDayVolunteer;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (date, timeSlot) => {
    const updated = formData.serviceAvailability.filter((entry) => entry.date !== date);
    updated.push({ date, timeSlot });
    setFormData((prev) => ({ ...prev, serviceAvailability: updated }));
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);

    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'photo.png', { type: 'image/png' });
        setImageFile(file);
      });
  }, [webcamRef]);

  const handleRetake = () => {
    setImage(null);
    setImageFile(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.whatsappNumber.trim()) return 'WhatsApp Number is required';
    if (!formData.dateOfBirth) return 'Date of Birth is required';
    if (!formData.age || Number(formData.age) <= 0) return 'Valid Age is required';
    if (!formData.gender) return 'Gender is required';
    if (!formData.contactPerson) return 'Contact person is required';
    if (!formData.profession) return 'Profession is required';
    if (!formData.maritalStatus) return 'Marital Status is required';
    if (!formData.collegeOrCompany.trim()) return 'College or Company name is required';
    if (showTshirtSelection && !formData.tShirtSize) return 'T-Shirt Size is required';
    if (showAccommodationSelection && (!formData.needAccommodation || (formData.needAccommodation !== 'Yes' && formData.needAccommodation !== 'No'))) {
      return 'Accommodation info is required and must be Yes or No';
    }
    if (!imageFile) return 'Photo is required. Please capture your photo below.';
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      toast({ title: 'Validation Error', description: error, status: 'error', duration: 3000 });
      return;
    }

    setLoading(true); 
    try {
      const payload = { ...formData };

      // Only remove tShirtSize if not shown for current volunteer
      if (!showTshirtSelection) {
        delete payload.tShirtSize;
      }
      // Only remove needAccommodation if not shown for current volunteer
      if (!showAccommodationSelection) {
        delete payload.needAccommodation;
      }
      if (!payload.infoSource) payload.infoSource = 'Other';
      payload.referredBy = formData.contactPerson || 'Other';
      delete payload.contactPerson;

      payload.locality = formData.location;
      delete payload.location;

      payload.tshirtSize = formData.tShirtSize;
      delete payload.tShirtSize;

      // Prevent sending empty string or invalid value for needAccommodation
      if (payload.needAccommodation !== "Yes" && payload.needAccommodation !== "No") {
        delete payload.needAccommodation;
      }

      const formDataToSend = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });
   
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await axios.post(
        "https://vrc-server-110406681774.asia-south1.run.app/volunteerform/api/volunteers",
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      toast({ title: 'Success', description: 'Volunteer registered.', status: 'success', duration: 3000 });
      setFormData({
        name: '',
        whatsappNumber: '',
        dateOfBirth: '',
        age: '',
        gender: '',
        maritalStatus: '',
        profession: '',
        collegeOrCompany: '',
        location: '',
        contactPerson: '',
        infoSource: '',
        serviceAvailability: [],
        tShirtSize: '',
        needAccommodation: ''
      });
      setImage(null);
      setImageFile(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Submission failed.',
        status: 'error',
        duration: 3000
      });
    }
    setLoading(false); 
  };

  return (
    <Box
      p={6}
      maxW="750px"
      mx="auto"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      borderRadius="xl"
      boxShadow="xl"
      position="relative"
      minHeight="600px"
    >
      {loading && (
        <Center
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255,255,255,0.7)"
          zIndex={99}
          borderRadius="xl"
          flexDirection="column"
        >
          <Spinner size="xl" color="teal.400" thickness="5px" />
          <Text mt={4} fontWeight="bold" color="teal.700">Submitting...</Text>
        </Center>
      )}
      <Image src={banner} width={"100%"} />
      <VStack spacing={4} align="stretch" bg="whiteAlpha.900" p={6} borderRadius="xl">
        <Heading size="lg" color="teal.600">Sri Krishna Janmashtami Volunteer Registration</Heading>

        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>WhatsApp Number</FormLabel>
          <Input value={formData.whatsappNumber} onChange={(e) => handleChange('whatsappNumber', e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Date of Birth</FormLabel>
          <Input type="date" value={formData.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Age</FormLabel>
          <Input type="number" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Gender</FormLabel>
          <Select placeholder="Select gender" value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Marital Status</FormLabel>
          <Select placeholder="Select" value={formData.maritalStatus} onChange={(e) => handleChange('maritalStatus', e.target.value)}>
            <option>Single</option>
            <option>Married</option>
          </Select>
        </FormControl>

        

<FormControl isRequired>
  <FormLabel>Profession</FormLabel>
  <Select
    placeholder="Please select the Profession*"
    value={formData.profession}
    onChange={(e) => handleChange('profession', e.target.value)}
  >
    <option value="Student">Student</option>
    <option value="Working">Working</option>
    <option value="Job Trails">Job Trails</option>
    <option value="Business">Business</option>
    <option value="Others">Others</option>
  </Select>
</FormControl>

        <FormControl isRequired>
          <FormLabel>College / Company Name</FormLabel>
          <Input value={formData.collegeOrCompany} onChange={(e) => handleChange('collegeOrCompany', e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Your Current Locality</FormLabel>
          <Input value={formData.location} onChange={(e) => handleChange('location', e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Whom you are in touch with Hare Krishna Movement?</FormLabel>
          <Select placeholder="Select devotee" value={formData.contactPerson} onChange={(e) => handleChange('contactPerson', e.target.value)}>
            {devotees.map((devotee) => (
              <option key={devotee.name} value={devotee.name}>{devotee.name}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>How did you get this information?</FormLabel>
          <Select placeholder="Select source" value={formData.infoSource} onChange={(e) => handleChange('infoSource', e.target.value)}>
            <option value="Whatsapp Group">Whatsapp Group</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Friends Reference">Friends Reference</option>
            <option value="Other">Other</option>
          </Select>
        </FormControl>

        {dates.map((date, idx) => (
          <Box
            key={date}
            bg={idx % 2 === 1 ? "gray.50" : "white"}
            borderRadius="md"
            p={4}
            mb={3}
          >
            <Text fontWeight="semibold" mb={2} fontSize="lg">{date}</Text>
            <RadioGroup
              onChange={(val) => handleServiceChange(date, val)}
              value={formData.serviceAvailability.find((d) => d.date === date)?.timeSlot || ''}
            >
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
                {timeSlots.map(slot => (
                  <Box
                    as="label"
                    key={slot.value}
                    htmlFor={`${date}-${slot.value}`}
                  >
                    <Radio
                      value={slot.value}
                      id={`${date}-${slot.value}`}
                      display="none"
                    />
                    <Box
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={3}
                      textAlign="center"
                      fontWeight="medium"
                      cursor="pointer"
                      background={
                        formData.serviceAvailability.find((d) => d.date === date)?.timeSlot === slot.value
                          ? "gray.200"
                          : "white"
                      }
                      transition="background 0.2s"
                      _hover={{
                        borderColor: "teal.400"
                      }}
                      sx={{
                        ...(formData.serviceAvailability.find((d) => d.date === date)?.timeSlot === slot.value
                          ? {
                              boxShadow: "0 0 0 2px #319795",
                              borderColor: "teal.500"
                            }
                          : {})
                      }}
                    >
                      {slot.label}
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            </RadioGroup>
          </Box>
        ))}

        {showTshirtSelection && (
          <FormControl isRequired>
            <FormLabel>T Shirt Size (for Full Day Volunteers)</FormLabel>
            <Select placeholder="Select size" value={formData.tShirtSize} onChange={(e) => handleChange('tShirtSize', e.target.value)}>
              <option value="XL">XL</option>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="S">S</option>
            </Select>
          </FormControl>
        )}

        {showAccommodationSelection && (
          <FormControl isRequired>
            <FormLabel>Need Accommodation?</FormLabel>
            <RadioGroup value={formData.needAccommodation} onChange={(val) => handleChange('needAccommodation', val)}>
              <Stack direction="row">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Stack>
            </RadioGroup>
            <Text fontSize="sm" color="gray.500">Please confirm with Sitanatha Dasa - 9059162108</Text>
          </FormControl>
        )}

        <Box mt={5}>
          <Heading size="md" color="teal.500" mb={2}>Capture Your Photo (Required)</Heading>
          {!image ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                width={320}
                videoConstraints={{ facingMode: "user" }}
                style={{ borderRadius: 8, marginBottom: 12 }}
                onUserMediaError={err => {
                  console.error("Camera error", err);
                  alert("Camera error: " + err.name);
                }}
              />
              <Button mt={2} onClick={capture} colorScheme="teal">Capture Photo</Button>
            </>
          ) : (
            <Box>
              <img src={image} alt="Captured" style={{ width: 180, borderRadius: 8 }} />
              <Button mt={2} onClick={handleRetake}>Retake</Button>
            </Box>
          )}
        </Box>

        <Button colorScheme="teal" size="lg" onClick={handleSubmit} isLoading={loading} loadingText="Submitting">
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default VolunteerForm;