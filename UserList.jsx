import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:3000/users')
            .then(response => setUsers(response.data))
    };

    const addUser = () => {
        if (name && email) {
            axios.post('http://localhost:3000/users', { name, email })
                .then(response => {
                    setUsers([...users, response.data]);
                    setName('');
                    setEmail('');
                })
        }
    };
    const editUser = (user) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
    };

    const updateUser = () => {
        if (name && email && editingUser) {
            axios.put(`http://localhost:3000/users/${editingUser.id}`, { name, email })
                .then(response => {
                    const updatedUsers = users.map(user =>
                        user.id === editingUser.id ? response.data : user
                    );
                    setUsers(updatedUsers);
                    setEditingUser(null);
                    setName('');
                    setEmail('');
                })
        }

    };
    const deleteUser = (userId) => {
        axios.delete(`http://localhost:3000/users/${userId}`)
            .then(() => {
                const filteredUsers = users.filter(user => user.id !== userId);
                setUsers(filteredUsers);
            })
    };
    return (
        <div>
            <h2>User List</h2>

            <div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {editingUser ? (
                    <button onClick={updateUser}>Update User</button>
                ) : (
                    <button onClick={addUser}>Add User</button>
                )}
            </div>


            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => editUser(user)}>Edit</button>
                            </td>
                            <td>
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
