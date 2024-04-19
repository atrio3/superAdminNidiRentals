import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Typography, Box, Grid, TextField, Button, IconButton, MenuItem } from '@mui/material';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

export default function EditForm({ formData, closeEvent }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (formData) {
      setName(formData.name || '');
      setLocation(formData.Location || '');
      setQuantity(formData.Quantity || '');
    }
  }, [formData]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLocationChange = (event) => {
    const selectedLocation = event.target.value;
    setLocation(selectedLocation); // Set the selected location first
  
    // Check if formData exists and if the selected location exists in the formData
    if (formData && formData.Location && formData.Location.includes(selectedLocation)) {
      const locationIndex = formData.Location.indexOf(selectedLocation);
      const selectedQuantity = formData.Quantity[locationIndex];
      setQuantity(selectedQuantity.toString()); // Set the quantity corresponding to the selected location
    } else {
      setQuantity(''); // If no matching location found, reset the quantity
    }
  };
  

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const updateVehicle = async () => {
    // Validate inputs
    if (!name || !location || !quantity) {
      Swal.fire("Error", "Please fill in all fields.", "error");
      return;
    }

    const userDoc = doc(db, "vehicleQuantityList", formData.id);
    try {
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const locationIndex = data.location.indexOf(location);
        if (locationIndex !== -1) {
          // Update the quantity for the selected location
          const updatedQuantity = [...data.quantity];
          updatedQuantity[locationIndex] = parseInt(quantity);
          const updatedData = {
            name,
            location: data.location, // Retain existing location
            quantity: updatedQuantity, // Update quantity for the selected location
          };
          await updateDoc(userDoc, updatedData);
          closeEvent();
          Swal.fire("Updated!", "Your changes have been saved.", "success");
        } else {
          Swal.fire("Error", "Selected location not found.", "error");
        }
      } else {
        console.log("Document not found");
      }
    } catch (error) {
      console.error("Error updating document:", error);
      Swal.fire("Error", "Failed to update vehicle details. Please try again later.", "error");
    }
  };

  return (
    <>
      <Box mt={2} />
      <Typography variant="h5" align="center">Edit Vehicle</Typography>
      <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={closeEvent}>
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="edit-name"
            label="Name"
            variant="outlined"
            size="small"
            onChange={handleNameChange}
            value={name}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="edit-location"
            label="Location"
            variant="outlined"
            size="small"
            select
            value={location}
            onChange={handleLocationChange}
            fullWidth
          >
            {formData && formData.Location && formData.Location.map((loc) => (
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="edit-quantity"
            label="Quantity"
            variant="outlined"
            size="small"
            onChange={handleQuantityChange}
            type="number"
            value={quantity}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={updateVehicle} fullWidth>Save Changes</Button>
        </Grid>
      </Grid>
      <Box mt={4} />
    </>
  );
}
