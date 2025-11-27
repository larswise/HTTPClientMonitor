
import { Box } from '@chakra-ui/react';
import './App.css'
import { Requests } from './components/Requests'
import { Toaster } from './components/ui/toaster';

function App() {

  return (
    <>
    <h2 style={{color: 'white', marginBottom: '8px', textAlign: 'left', width: '80%', margin: '0 auto 8px auto', paddingLeft: '8px'}}>HTTP Client Monitor</h2>
      <Box><Requests /><Toaster /></Box>
      </>
  )
}

export default App