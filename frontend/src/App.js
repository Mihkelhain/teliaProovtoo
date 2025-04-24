// frontend/src/App.js
import React, { useState, useEffect } from 'react';

function App() {
    const [isikud, setIsikud] = useState([]);
    const [formData, setFormData] = useState({
        nimi: '',
        email: '',
        sunnipaev: '',
        isikukood: ''
    });

    useEffect(() => {
        fetchIsikud();
    }, []);



    const fetchIsikud = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/isikud');
            if (!response.ok) throw new Error('Network response was not ok');
            else console.log("network response ok");
            const data = await response.json();
            console.log(data);

            setIsikud(data);
        } catch (error) {
            console.error('Error fetching isikud:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/isikud', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const newIsik = await response.json();
            setIsikud([...isikud, newIsik]);
            setFormData({
                nimi: '',
                email: '',
                sunnipaev: '',
                isikukood: ''
            });
        } catch (error) {
            console.error('Error adding isik:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/isikud/${id}`, {
                method: 'DELETE'
            });
            console.log(response)

            if (!response.ok) {
                throw new Error('Delete failed');
            }
            else fetchIsikud();
        } catch (error) {
            console.error('Delete failed: ', error);
        }
    };

    return (<div style={{padding: '20px'}}>
            <h1>Isikud</h1>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                <tr>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>ID</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>Nimi</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>Email</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>Sünnipäev</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>Isikukood</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {isikud.map(isik => (<tr key={isik.id}>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.id}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.nimi}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.email}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.sunnipaev}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.isikukood}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>
                            <button
                                onClick={() => handleDelete(isik.id)}
                                style={{
                                    background: 'red',
                                    color: 'white',
                                    padding: '8px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}

                            >
                                Delete
                            </button>
                        </td>
                    </tr>))}
                </tbody>
            </table>

            <h2>Lisa uus isik</h2>
            <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nimi:</label>
                    <input
                        type="text"
                        name="nimi"
                        value={formData.nimi}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Sünnipäev:</label>
                    <input
                        type="date"
                        name="sunnipaev"
                        value={formData.sunnipaev}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Isikukood:</label>
                    <input
                        type="text"
                        name="isikukood"
                        value={formData.isikukood}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Lisa isik
                </button>
            </form>
        </div>
    );
}

export default App;