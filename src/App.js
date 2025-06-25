import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Registeration from './Registeration';
import { Route, Routes } from 'react-router-dom';
import ServiceTypeManager from './ServiceTypeManager';
import MinimalMeetupForm1 from './MinimalMeetupForm1';
import VolunteerDashboard from './VolunteerDashboard';
import VolunteerRegistrationForm from './VolunteerRegistrationForm';
import ManagerList from './ManagerList';
import ServiceForm from './ServiceForm';
import ServiceList from './ServiceList';
import EventsList from './EventList';
import QrAttendanceScanner from './QrAttendanceScanner';
import Siva from './Siva';
// import MinimalMeetupForm from './MinimalMeetupForm.JSX';
// import MinimalMeetupForm from './MinimalMeetupForm';
// import MinimalMeetupForm from './MinimalMeetupForm.JSX';
// import MinimalMeetupForm from './MinimalMeetupForm';



function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
      {/* <Route path='/' element={ <Registeration/>}/> */}
      <Route path='/service' element={ <ServiceTypeManager/>}/>
      <Route path='/meetup' element={ <MinimalMeetupForm1/>}/>
      <Route path='/' element={ <VolunteerDashboard/>}/>
      <Route path='/Registeration' element={<VolunteerRegistrationForm/>}/>
      <Route path='/manager' element={<ManagerList/>}/>
      <Route path='/post-service' element={<ServiceForm/>}/>
      <Route path='/service-list' element={<ServiceList/>}/>
      <Route path='/event-list' element={<EventsList/>}/>
      <Route path='/scanner' element={<QrAttendanceScanner/>}/>
      <Route path='/attendence' element={<Siva/>}/>
      </Routes>
   
    </ChakraProvider>
  );
}

export default App;
