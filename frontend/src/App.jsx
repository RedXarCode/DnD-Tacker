import { useEffect, useState } from 'react'
import CreatureList from './CreatureList'
import CreatureForm from './CreatureForm'
import './App.css'

function App() {
  const [creatures, setCreatures] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCreatue, setCurrentCreature] = useState({})

  useEffect(() => {
    fetchCreatures()
  }, [])

  const fetchCreatures = async () => {
    const response = await fetch("/creatures")
    const data = await response.json() 
    setCreatures(data.creatures)
    console.log(data.creatures)
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentCreature({})
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }; 

  const openEditModal = (creature) => {
    if (isModalOpen) return
    setCurrentCreature(creature)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchCreatures()
  }

  return (
    <>
      <CreatureList creatures={creatures} updateCreature={openEditModal} updateCallback={onUpdate}/>
      <button onClick={openCreateModal}>Add New Creature</button>
      {
        isModalOpen && <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={closeModal}>&times;</span>
            <CreatureForm existingCreature={currentCreatue} updateCallback={onUpdate}/>
          </div>
        </div>
      }
      
    </>
    
  )
}

export default App
