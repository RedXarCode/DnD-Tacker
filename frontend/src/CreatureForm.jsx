import { useState } from "react";

const CreatureForm = ({ existingCreature = {}, updateCallback}) => {
    const [name, setName] = useState(existingCreature.name || "")
    const [initiative, setInitiative] = useState(existingCreature.initiative || "")
    const [hp, setHp] = useState(existingCreature.hp || "")
    const [maxHp, setMaxHp] = useState(existingCreature.maxHp || "")
    const [ac, setAc] = useState(existingCreature.ac || "")
    const [conditions, setConditions] = useState(existingCreature.conditions || "")

    const updating = Object.entries(existingCreature).length !== 0

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            name,
            initiative,
            hp,
            maxHp,
            ac,
            conditions
        }
        const url = updating ? `/update_creature/${existingCreature.id}` : "/create_creature"
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            updateCallback()
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <p>Name and Initiative properties are both required, all others are optional, and are simply for the GMs convenience. 
                If Current HP is left blank, it will automatically be set to Max HP</p>
            <div>
                <label htmlFor="name">Creature Name:</label>
                <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="initiative">Initiative:</label>
                <input 
                    type="number" 
                    id="initiative" 
                    value={initiative} 
                    onChange={(e) => setInitiative(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="hp">Current HP:</label>
                <input 
                    type="number" 
                    id="hp" 
                    value={hp} 
                    onChange={(e) => setHp(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="maxHp">Maximum HP:</label>
                <input 
                    type="number" 
                    id="maxHp" 
                    value={maxHp} 
                    onChange={(e) => setMaxHp(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="ac">Armor Class:</label>
                <input 
                    type="number" 
                    id="ac" 
                    value={ac} 
                    onChange={(e) => setAc(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="conditions">Active Conditions or Effects:</label>
                <input 
                    type="text" 
                    id="conditions" 
                    value={conditions} 
                    onChange={(e) => setConditions(e.target.value)}
                />
            </div>
            <button type="submit">{updating ? "Update" : "Create"} Creature</button>
        </form>
    )
}

export default CreatureForm