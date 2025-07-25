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
import Balaji from './Balaji';
import ProjectList from './ProjectList';
import ProjectCreateForm from './project/ProjectCreateForm';
import ProjectDetails from './project/ProjectDetails';
import StatusUsers from './StatusUsers';
import July from './July';
import UserTable from './UsersTable';
import VolunteerTableWithModal from './project/volunteerTable';
import VolunteerForm from './project/VolunteerForm';
import ServiceCoordinatorForm from './project/ServiceCoordinatorForm';

import Login from './project/Login';
import NotFound from './project/NotFound';
import PrivateRoute from './Private/PrivateRoute';
import Register from './project/Register';
import VolunteerAttendance from './project/VolunteerAttendance';




function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
      {/* <Route path='/' element={ <Registeration/>}/> */}
      <Route path='/service' element={ <ServiceTypeManager/>}/>
      <Route path='/meetup' element={ <MinimalMeetupForm1/>}/>
      <Route path='/Registeration' element={<VolunteerRegistrationForm/>}/>
      <Route path='/manager' element={<ManagerList/>}/>
      <Route path='/post-service' element={<ServiceForm/>}/>
      <Route path='/service-list' element={<ServiceList/>}/>
      <Route path='/event-list' element={<EventsList/>}/>
      <Route path='/scanner' element={<QrAttendanceScanner/>}/>
      <Route path='/attendence' element={<Siva/>}/>
      <Route path='/service/:id?' element={<Balaji />} />
      <Route path='/project' element={<ProjectList />} />
      <Route path='/create/project' element={<ProjectCreateForm />} />
      <Route path='/project/:id' element={<ProjectDetails />} />
      <Route path='/fcuser/attendece' element={<StatusUsers/>} />
      <Route path='/july/user/attendece' element={<July/>} />
      <Route path='/july/flc/attendece' element={<UserTable/>} />
      <Route path='/volunteerform' element={<VolunteerForm/>}/>
      <Route path='/servicecoordinatorform' element={<ServiceCoordinatorForm/>}/>
      <Route path='*' element={<NotFound/>}/>
      <Route path='/' element={ <PrivateRoute><VolunteerTableWithModal/></PrivateRoute>}/>
      <Route path='/api/admin/login' element={<Login/>}/>
      <Route path='/api/admin/register' element={<Register/>}/>
      <Route path='/api/attendance' element={<VolunteerAttendance/>} />
      </Routes>
   
    </ChakraProvider>
  );
}

export default App;
