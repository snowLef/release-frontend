import React from 'react';

export default function ReleasePersons({persons, handlePersonChange, removePerson, addPerson}) {
    return (
        /* СЕКЦИЯ 3: Персоны и роли */
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Персоны и роли</h2>
                <p className="card-description">
                    Для Исполнителей, Сокисполнителей (feat.), Remixer необходимо указать псевдоним
                    артиста, группы или проекта
                </p>
            </div>

            <div className="card-body">
                {persons.map((person) => (
                    <div key={person.id} className="person-row">
                        <div className="person-inputs">
                            <div className="input-group">
                                <label className="form-label">Имя персоны</label>
                                <input
                                    type="text"
                                    value={person.name}
                                    onChange={(e) => handlePersonChange(person.id, 'name', e.target.value)}
                                    className="input-field"
                                    placeholder="Введите имя"
                                />
                            </div>

                            <div className="input-group">
                                <label className="form-label">Роль персоны</label>
                                <select
                                    value={person.role}
                                    onChange={(e) => handlePersonChange(person.id, 'role', e.target.value)}
                                    className="input-field form-select"
                                >
                                    <option value="Исполнитель">Исполнитель</option>
                                    <option value="feat.">feat.</option>
                                    <option value="Remixer">Remixer</option>
                                </select>
                            </div>
                        </div>

                        {persons.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removePerson(person.id)}
                                className="btn-remove-person"
                                title="Удалить"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addPerson}
                    className="btn-secondary"
                    style={{marginTop: '1rem'}}
                >
                    ➕ Добавить
                </button>
            </div>
        </div>
    );
}