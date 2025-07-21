import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import EditForm from "./EditForm";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Locations = [
  { value: "KJC KOTHANUR", label: "KJC KOTHANUR" },
  { value: "REVA", label: "REVA" },
  { value: "KEMPAPURA", label: "KEMPAPURA" },
  { value: "ITPL", label: "ITPL" },
  { value: "MARTHAHALLI", label: "MARTHAHALLI" },
];

const vehicleTypes = [
  { value: "All", label: "All" },
  { value: "Bike", label: "Bike" },
  { value: "Scooty", label: "Scooty" },
  { value: "Car", label: "Car" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const headerCellStyle = {
  fontWeight: "bold",
  backgroundColor: "#f2f2f2",
};

const cellStyle = {
  borderBottom: "1px solid #ddd",
};

export default function VehicleList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const empCollectionRef = collection(db, "vehicleQuantityList");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [vehicleType, setVehicleType] = useState("All");

  const handleOpen = () => setOpen(true);
  const handleEditOpen = () => setEditOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);

  useEffect(() => {
    getVehicles();
  }, []);

  const getVehicles = async () => {
    const data = await getDocs(empCollectionRef);
    const formattedData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setRows(formattedData);
    setFilteredRows(formattedData); // Set filtered rows initially to all rows
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteVehicles = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteApi(id);
      }
    });
  };

  const deleteApi = async (id) => {
    const userDoc = doc(db, "vehicleQuantityList", id);
    await deleteDoc(userDoc);
    Swal.fire("Deleted!", "Your file has been deleted.", "success");
    getVehicles();
  };

  const filterData = (selectedLocation, selectedType = vehicleType) => {
    let filtered = rows;
    if (selectedLocation) {
      filtered = filtered.filter(
        (row) => row.location && row.location.includes(selectedLocation)
      );
    }
    if (selectedType && selectedType !== "All") {
      filtered = filtered.filter(
        (row) =>
          row.type &&
          row.type.toLowerCase().includes(selectedType.toLowerCase())
      );
    }
    setFilteredRows(filtered);
  };

  // Update filter when vehicleType changes
  useEffect(() => {
    filterData(null, vehicleType);
    // eslint-disable-next-line
  }, [vehicleType, rows]);

  const editData = (name, location, quantity, id) => {
    const data = {
      name: name,
      Location: location,
      Quantity: quantity,
      id: id,
    };
    setFormData(data);
    handleEditOpen();
  };

  const addVehicleToDatabase = async (newVehicleData) => {
    await addDoc(empCollectionRef, newVehicleData);
  };

  const addVehicle = async (newVehicleData) => {
    await addVehicleToDatabase(newVehicleData);
    getVehicles(); // Refresh data after adding
    handleClose();
  };

  return (
    <>
      <div>
        <Modal
          open={editOpen}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <EditForm closeEvent={handleEditClose} formData={formData} />
          </Box>
        </Modal>
      </div>

      {filteredRows.length > 0 && (
        <Paper
          sx={{
            width: "97%",
            overflow: "hidden",
            padding: "12px",
            margin: "10px",
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "30px" }}
          >
            Vehicles List
          </Typography>
          <Divider />
          <Box height={10} />
          <Stack direction="row" spacing={2} className="my-2 mb-2">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={Locations.map((option) => option.value)}
              sx={{ width: 300 }}
              onChange={(e, selectedLocation) =>
                filterData(selectedLocation, vehicleType)
              }
              renderInput={(params) => (
                <TextField {...params} size="small" label="Search Location" />
              )}
            />
            <Select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              size="small"
              sx={{ width: 180, background: "#fff" }}
            >
              {vehicleTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
          </Stack>
          <Box height={10} />
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    style={{ ...headerCellStyle, minWidth: "150px" }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ ...headerCellStyle, minWidth: "100px" }}
                  >
                    Location / Quantity
                  </TableCell>
                  {/* <TableCell align="left" style={{ ...headerCellStyle, minWidth: "150px" }}>
                    Location
                  </TableCell> */}
                  <TableCell
                    align="left"
                    style={{ ...headerCellStyle, minWidth: "100px" }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell align="left" style={cellStyle}>
                          {row.name}
                        </TableCell>
                        <TableCell align="left" style={cellStyle}>
                          {Array.isArray(row.quantity) &&
                          Array.isArray(row.location)
                            ? row.location.map((loc, index) => (
                                <div key={index}>
                                  {loc}: {row.quantity[index]}
                                </div>
                              ))
                            : ""}
                        </TableCell>
                        {/* <TableCell align="left" style={cellStyle}>
                          {Array.isArray(row.location) ? row.location.join(", ") : ""}
                        </TableCell> */}
                        <TableCell align="left" style={cellStyle}>
                          <Stack spacing={2} direction="row">
                            <EditIcon
                              style={{
                                fontSize: "20px",
                                color: "#fc5f49",
                                cursor: "pointer",
                              }}
                              className="cursor-pointer"
                              onClick={() =>
                                editData(
                                  row.name,
                                  row.location,
                                  row.quantity,
                                  row.id
                                )
                              }
                            />
                            <DeleteIcon
                              style={{
                                fontSize: "20px",
                                color: "darkred",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                deleteVehicles(row.id);
                              }}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </>
  );
}
