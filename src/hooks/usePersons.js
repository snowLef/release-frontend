import { useState } from 'react';

export function usePersons() {
    const [persons, setPersons] = useState([
        { id: 1, name: '', role: 'Исполнитель' }
    ]);

    const handlePersonChange = (id, field, value) => {
        setPersons(persons.map(person =>
            person.id === id ? { ...person, [field]: value } : person
        ));
    };

    const addPerson = () => {
        const newId = Math.max(...persons.map(p => p.id), 0) + 1;
        setPersons([...persons, { id: newId, name: '', role: 'Исполнитель' }]);
    };

    const removePerson = (id) => {
        if (persons.length > 1) {
            setPersons(persons.filter(person => person.id !== id));
        }
    };

    return { persons, handlePersonChange, addPerson, removePerson, setPersons };
}
