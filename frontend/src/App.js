
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React, { useState, useEffect } from 'react';
import './App.css'

function App() {
    const [isikud, setIsikud] = useState([]);
    const [formData, setFormData] = useState({
        eesnimi: '',
        perenimi: '',
        email: '',
        sunnipaev: '',
        isikukood: ''
    });
    const[editVis, setEditVis] = useState({});
    const[editIsik,setEditIsik] = useState({});
    useEffect(() => {fetchIsikud();}, []);

// reminder 8080/api is the api the server itself is at 3000

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
                eesnimi: '',
                perenimi: '',
                email: '',
                sunnipaev: '',
                isikukood: ''
            });
        } catch (error) {
            console.error('Error adding isik:', error);
        }
    };
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
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

    //setEditVis is for the popup section
    //we take the object and then bim bam boom we have changes
    //also remember this shit updates
    const handleUpdate = async (isik) => {
        setEditVis(prev => ({prev, [isik.id]: !prev[isik.id]}));
        console.log(isik)
        if (editVis[isik.id]) {
            try {
                const response = await fetch(`http://localhost:8080/api/isikud/${isik.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editIsik[isik.id])
                });

                if (!response.ok) throw new Error('patch fail');
                fetchIsikud();
            } catch (error) {
                console.error('patch fail: ', error);
            }
        }
    };
    const handleEditChange = (e, field, isikId) => {
        setEditIsik(prev => ({prev, [isikId]: {...prev[isikId], [field]: e.target.value}}));
    };


    return <div style={{padding: '20px'}}>
            <h1>Isikud</h1>
        <div id={"isikListScr"}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                <tr> {/*Top of boxes annotations for the presesntation something*/}
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>ID</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>eesnimi</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>perenimi</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>Email</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>Sünnipäev</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>Isikukood</th>
                    <th style={{border: '1px solid #ddd', padding: '8px'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {/*Actual data gets presented by these tds >:)*/}
                {isikud.map(isik => <tr key={isik.id}>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.id}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.eesnimi}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.perenimi}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.email}</td>
                    {/*This is solely needed cause i dont like mm-dd-yyyy and the additonal fact is that sunnipaev is nullable so need to check that also,it might not be in the future tho*/}
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.sunnipaev ? new Date(isik.sunnipaev).toLocaleDateString('en-GB') : ''}</td>

                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{isik.isikukood}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>
                            <div>
                            <Popup trigger=
                                       {<button style={{background:'yellow',color:'black',padding:'8px',border:'none',borderRadius:'4px',cursor:'pointer'}}> Details </button>}
                                   modal nested>
                                {close => (
                                        <div className='modal'>
                                            <div className='content'>
                                               <div style={{border:"solid"}}>
                                                   <p>Id: {isik.id} </p>
                                               </div>

                                                {/*These are the data presentation of the details view also keep in mind that input window is hidden until the edit button is pressed once and hidden again when pressed again*/}

                                                <div style={{border:"solid"}}>
                                                    <p>Eesnimi: {isik.eesnimi} </p>
                                                    <input type={"text"} style={{display:editVis[isik.id] ? 'block' : 'none'}} placeholder={isik.eesnimi} onChange={(e) => handleEditChange(e,'eesnimi',isik.id)}></input>
                                                </div>

                                                <div style={{border:"solid"}}>
                                                    <p>Perenimi: {isik.perenimi} </p>
                                                    <input type={"text"} style={{display:editVis[isik.id] ? 'block' : 'none'}} placeholder={isik.perenimi} onChange={(e) => handleEditChange(e,'perenimi',isik.id)}></input>

                                                </div>

                                                <div style={{border:"solid"}}>
                                                    <p>Email: {isik.email}</p>
                                                    <input type={"text"} style={{display:editVis[isik.id] ? 'block' : 'none'}} placeholder={isik.email } onChange={(e) => handleEditChange(e,'email',isik.id)}></input>
                                                </div>

                                               <div style={{border:"solid"}}>
                                                   <p>Sünnipäev: {isik.sunnipaev ? new Date(isik.sunnipaev).toLocaleDateString('en-GB') : ''}</p>
                                                   <input type={"date"} style={{display:editVis[isik.id] ? 'block' : 'none'}} placeholder={isik.sunnipaev} onChange={(e) => handleEditChange(e,'sunnipaev',isik.id)}></input>
                                               </div>

                                                <div style={{border:"solid"}}>
                                                    <p>Isikukood: {isik.isikukood}</p>
                                                    <input type={"text"} style={{display:editVis[isik.id] ? 'block' : 'none'}} placeholder={isik.isikukood} onChange={(e) => handleEditChange(e,'isikukood',isik.id)}></input>
                                                </div>
                                                {/*
                                                TODO Also maybe add pictures to details view?????????????
                                                TODO Also there is a need to make the webpage searchable and orderable depending on the datatype
                                                */}
                                                <div>
                                                    <button onClick={() => handleUpdate(isik)}
                                                            style={{background:editVis[isik.id] ? 'green' : 'yellow', color: 'black', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>{editVis[isik.id] ? "Accept changes" : "edit"  }
                                                    </button>
                                                </div>

                                            </div>
                                            <div>
                                                <button onClick=
                                                            {() => close()}>
                                                    Close Details
                                                </button>
                                            </div>
                                        </div>

                                    )
                                }
                            </Popup>
                        </div>
                            <button onClick={() => handleDelete(isik.id)}
                                    style={{background: 'red', color: 'white', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Delete
                            </button>
                    </td>

                    </tr>)}
                </tbody>
            </table>
        </div>



        {/*
        TODO Works but needs a rework on the visual side of things
        maybe make the presentation scroll inside the webpage or something like that
        */}
            <h2>Lisa uus isik</h2>
            <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Eesnimi:</label>
                    <input
                        type="text"
                        name="eesnimi"
                        value={formData.eesnimi}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Perenimi:</label>
                    <input
                        type="text"
                        name="perenimi"
                        value={formData.perenimi}
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
        </div>;
}
export default App;