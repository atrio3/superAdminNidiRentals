import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Typography, Box, Grid, TextField, Button, MenuItem, IconButton } from '@mui/material';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

const Locations = [
  {
    value: 'KJC KOTHANUR',
    label: 'KJC KOTHANUR',
  },
  {
    value: 'REVA',
    label: 'REVA',
  },
  {
    value: 'KEMPAPURA',
    label: 'KEMPAPURA',
  },
  {
    value: 'ITPL',
    label: 'ITPL',
  },
  {
    value: 'MARTHAHALLI',
    label: 'MARTHAHALLI',
  },
];

export default function AddForm({ closeEvent }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rows, setRows] = useState([]);
  const empCollectionRef = collection(db, 'vehicleQuantityList');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const createVehicle = async () => {
    await addDoc(empCollectionRef, {
      name: name,
      location: [location], // Convert location to an array with a single element
      quantity: [Number(quantity)], // Convert quantity to an array with a single element
    });
    getVehicles();
    closeEvent();
    Swal.fire('Submitted!', 'Your file has been submitted.', 'success');
  };
  
  

  const getVehicles = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Add Vehicle
      </Typography>
      <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={closeEvent}>
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            size="small"
            onChange={handleNameChange}
            value={name}
            sx={{ minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="outlined-basic"
            label="Location"
            variant="outlined"
            size="small"
            select
            value={location}
            onChange={handleLocationChange}
            sx={{ minWidth: '100%' }}
          >
            {Locations.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            size="small"
            onChange={handleQuantityChange}
            type="number"
            value={quantity}
            sx={{ minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            <Button variant="contained" onClick={createVehicle}>
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ m: 4 }} />
    </>
  );
}
