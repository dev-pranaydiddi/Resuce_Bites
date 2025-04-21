import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      
        <Button variant="outline" className={'text-black'}>Click me</Button>
    
    
      </div>
    </>
  )
}

export default App
