import React, { useState } from 'react';
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
  useToast
} from '@chakra-ui/react';
// import { FormControl, FormLabel } from '@chakra-ui/form-control';
// ✅ Correct
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import axios from 'axios';


const devotees = [
  { name: 'Sitanatha Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Rama Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Gauranga Dasa', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'mani teja prabhu', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
  { name: 'Not associated ', img: 'https://www.harekrishnavizag.org/assets/img/about_1.jpg' },
 
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

  const toast = useToast();

  const isYoungBoy = Number(formData.age) > 0 && Number(formData.age) < 30 && formData.gender === 'Male';
  const isFullDayVolunteer = formData.serviceAvailability.some((entry) => entry.timeSlot === 'Full Day');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (date, timeSlot) => {
    const updated = formData.serviceAvailability.filter((entry) => entry.date !== date);
    updated.push({ date, timeSlot });
    setFormData((prev) => ({ ...prev, serviceAvailability: updated }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.whatsappNumber.trim()) return 'WhatsApp Number is required';
    if (!formData.dateOfBirth) return 'Date of Birth is required';
    if (!formData.age || Number(formData.age) <= 0) return 'Valid Age is required';
    if (!formData.gender) return 'Gender is required';
    if (!formData.contactPerson) return 'Contact person is required';
    if (isYoungBoy && !formData.profession) return 'Profession is required';
    if (isYoungBoy && !formData.maritalStatus) return 'Marital Status is required';
    if (isYoungBoy && !formData.collegeOrCompany.trim()) return 'College or Company name is required';
    if (isFullDayVolunteer && !formData.tShirtSize) return 'T-Shirt Size is required';
    if (isFullDayVolunteer && !formData.needAccommodation) return 'Accommodation info is required';
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      toast({ title: 'Validation Error', description: error, status: 'error', duration: 3000 });
      return;
    }

    try {
      const payload = { ...formData };

      if (!isYoungBoy) {
        delete payload.profession;
        delete payload.maritalStatus;
        delete payload.collegeOrCompany;
      }

      if (!isFullDayVolunteer) {
        delete payload.tShirtSize;
        delete payload.needAccommodation;
      }

      if (!payload.profession && isYoungBoy) payload.profession = 'Student';
      if (!payload.infoSource) payload.infoSource = 'Other';
      payload.referredBy = formData.contactPerson || 'Other';
      delete payload.contactPerson;

      payload.locality = formData.location;
      delete payload.location;

      payload.tshirtSize = formData.tShirtSize;
      delete payload.tShirtSize;

      await axios.post('http://localhost:3300/volunteerform/api/volunteers', payload);
      toast({ title: 'Success', description: 'Volunteer registered.', status: 'success', duration: 3000 });
      setFormData({
        name: '', whatsappNumber: '', dateOfBirth: '', age: '', gender: '', maritalStatus: '', profession: '',
        collegeOrCompany: '', location: '', contactPerson: '', infoSource: '', serviceAvailability: [],
        tShirtSize: '', needAccommodation: ''
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Submission failed.',
        status: 'error',
        duration: 3000
      });
    }
  };

  return (
    <Box
      p={6}
      maxW="600px"
      mx="auto"
   
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      borderRadius="xl"
      boxShadow="xl"
    >
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

        {isYoungBoy && (
          <>
            <FormControl>
              <FormLabel>Marital Status</FormLabel>
              <Select placeholder="Select" value={formData.maritalStatus} onChange={(e) => handleChange('maritalStatus', e.target.value)}>
                <option>Single</option>
                <option>Married</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Profession</FormLabel>
              <Select value={formData.profession} onChange={(e) => handleChange('profession', e.target.value)}>
                <option>Student</option>
                <option>Working</option>
                <option>Job Trails</option>
                <option>Business</option>
                <option>Others</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>College / Company Name</FormLabel>
              <Input value={formData.collegeOrCompany} onChange={(e) => handleChange('collegeOrCompany', e.target.value)} />
            </FormControl>
          </>
        )}

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

        {["August 14", "August 15", "August 16", "August 17"].map((date) => (
          <FormControl key={date}>
            <FormLabel>Service Availability for {date}</FormLabel>
            <RadioGroup
              onChange={(val) => handleServiceChange(date, val)}
              value={formData.serviceAvailability.find((d) => d.date === date)?.timeSlot || ''}
            >
              <Stack direction="column">
                <Radio value="Full Day">9am to 9pm (Full Day)</Radio>
                <Radio value="Half Day 2pm">2pm to 9pm (Half Day)</Radio>
                <Radio value="Half Day 4pm">4pm to 9pm (Half Day)</Radio>
                <Radio value="Not Possible">Not Possible</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        ))}

        {isYoungBoy && isFullDayVolunteer && (
          <>
            <FormControl>
              <FormLabel>T Shirt Size (for Full Day Volunteers)</FormLabel>
              <Select placeholder="Select size" value={formData.tShirtSize} onChange={(e) => handleChange('tShirtSize', e.target.value)}>
                <option value="XL">XL</option>
                <option value="L">L</option>
                <option value="M">M</option>
                <option value="S">S</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Need Accommodation?</FormLabel>
              <RadioGroup value={formData.needAccommodation} onChange={(val) => handleChange('needAccommodation', val)}>
                <Stack direction="row">
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Stack>
              </RadioGroup>
              <Text fontSize="sm" color="gray.500">Please confirm with Sitanatha Dasa - 9059162108</Text>
            </FormControl>
          </>
        )}

        <Button colorScheme="teal" size="lg" onClick={handleSubmit}>Submit</Button>
      </VStack>
    </Box>
  );
};

export default VolunteerForm;