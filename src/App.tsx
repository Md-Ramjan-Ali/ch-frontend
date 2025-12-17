import { ThemeProvider } from './hooks/useTheme'
import Layout from './Layout/Layout'

function App() {

  return (
    <>
   <div className='overflow-hidden'>
     
       <ThemeProvider>
       <Layout></Layout>
    </ThemeProvider>
   </div>
    </>
  )
}

export default App
