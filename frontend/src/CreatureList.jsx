import React from "react";

const CreatureList = ({creatures, updateCreature, updateCallback}) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`/api/delete_creature/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }

    const onDuplicate = async (id) => {
        try {
            const options = {
                method: "POST"
            }
            const response = await fetch(`/api/duplicate_creature/${id}`, options)
            if (response.status === 201) {
                updateCallback()
            } else {
                console.error("Failed to duplicate")
            }
        } catch (error) {
            alert(error)
        }
    }

    return <div>
        <h1>D&D Initiative Tracker</h1>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Init.</th>
                    <th>HP</th>
                    <th>Max HP</th>
                    <th>AC</th>
                    <th>Active Conditions</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                {creatures.map((creature) => (
                    <tr key={creature.id}>
                        <td>{creature.name}</td>
                        <td>{creature.initiative}</td>
                        <td>{creature.hp}</td>
                        <td>{creature.maxHp}</td>
                        <td>{creature.ac}</td>
                        <td>{creature.conditions}</td>
                        <td>
                            <button onClick={() => updateCreature(creature)}>Update</button>
                            <button onClick={() => onDuplicate(creature.id)}>Duplicate</button>
                            <button onClick={() => onDelete(creature.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default CreatureList