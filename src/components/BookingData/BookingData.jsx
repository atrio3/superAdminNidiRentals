import React, { useState, useEffect } from "react";
import { ref, onValue, push, set, remove } from "firebase/database";
import { database } from "../../firebase";
import "./BookingData.css";
import { Edit, Delete, Search } from "@mui/icons-material"; // Assuming Search icon exists
import { CSVLink } from "react-csv";

const BookingData = () => {
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    userLocation: "",
    tel: "",
    drivingID: "",
    vehicle_name: "",
    vehicle_price: "",
    vehicle_category: "",
    pickUpDate: "",
    dropOffDate: "",
    time: "",
    rentAmount: "",
    image_Url: "",
    vehicle_id: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterLocation, setFilterLocation] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const dbRef = ref(database);

    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userDetailsArray = Object.entries(data.UserDetails || {}).map(
          ([key, value]) => ({
            id: key,
            ...value,
          })
        );
        setTableData(userDetailsArray);
      }
    });
  }, []);

  useEffect(() => {
    if (filterLocation !== "") {
      const filtered = tableData.filter(
        (user) => user.userLocation === filterLocation
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(tableData);
    }
  }, [filterLocation, tableData]);

  useEffect(() => {
    if (searchQuery !== "") {
      const filtered = tableData.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(tableData);
    }
  }, [searchQuery, tableData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddData = async () => {
    await push(ref(database, "UserDetails"), formData);
    setFormData({
      name: "",
      email: "",
      address: "",
      userLocation: "",
      tel: "",
      drivingID: "",
      vehicle_name: "",
      vehicle_price: "",
      vehicle_category: "",
      pickUpDate: "",
      dropOffDate: "",
      time: "",
      rentAmount: "",
      image_Url: "",
      vehicle_id: "",
    });
  };

  const handleEdit = (id) => {
    const editData = tableData.find((item) => item.id === id);
    setFormData(editData);
    setEditMode(true);
    setEditId(id);
  };

  const handleUpdate = async () => {
    await set(ref(database, `UserDetails/${editId}`), formData);
    setEditMode(false);
    setEditId(null);
    setFormData({
      name: "",
      email: "",
      address: "",
      userLocation: "",
      tel: "",
      drivingID: "",
      vehicle_name: "",
      vehicle_price: "",
      vehicle_category: "",
      pickUpDate: "",
      dropOffDate: "",
      time: "",
      rentAmount: "",
      image_Url: "",
      vehicle_id: "",
    });
  };

  const handleDelete = async (id) => {
    await remove(ref(database, `UserDetails/${id}`));
  };

  useEffect(() => {
    const tableRows = document.querySelectorAll(".booking-table tbody tr");

    tableRows.forEach((row) => {
      row.addEventListener("click", function () {
        this.classList.toggle("expanded-row");
      });
    });
  }, []);

  const formatTime = (timeString) => {
    const timeParts = timeString.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    let amOrPm = "AM";
    let formattedHours = hours;

    if (hours >= 12) {
      amOrPm = "PM";
      formattedHours = hours === 12 ? 12 : hours - 12;
    }

    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${amOrPm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getUniqueLocations = () => {
    const uniqueLocations = new Set();
    tableData.forEach((user) => uniqueLocations.add(user.userLocation));
    return Array.from(uniqueLocations);
  };

  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
    { label: "Location Selected", key: "userLocation" },
    { label: "Phone no", key: "tel" },
    { label: "Driving ID", key: "drivingID" },
    { label: "Selected Vehicle", key: "vehicle_name" },
    { label: "Vehicle Price", key: "vehicle_price" },
    { label: "Vehicle Category", key: "vehicle_category" },
    { label: "Pickup Date", key: "pickUpDate" },
    { label: "Drop-off Date", key: "dropOffDate" },
    { label: "Time", key: "time" },
    { label: "Total Paid Amount", key: "rentAmount" },
    { label: "Driving ID Image", key: "image_Url" },
  ];

  return (
    <div className="booking-data-container">
      <h2 className="booking-data-title">Booking Data:</h2>
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Vehicle Id:</label>
          <input
            type="Number"
            id="vehicle_id"
            name="vehicle_id"
            value={formData.vehicle_id}
            onChange={handleInputChange}
            placeholder="vehicle_id"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="userLocation">Location Selected:</label>
          <input
            type="text"
            id="userLocation"
            name="userLocation"
            value={formData.userLocation}
            onChange={handleInputChange}
            placeholder="Location Selected"
          />
        </div>
        <div className="form-group">
          <label htmlFor="tel">Phone No.:</label>
          <input
            type="tel"
            id="tel"
            name="tel"
            value={formData.tel}
            onChange={handleInputChange}
            placeholder="Phone No."
          />
        </div>
        <div className="form-group">
          <label htmlFor="drivingID">Driving ID:</label>
          <input
            type="text"
            id="drivingID"
            name="drivingID"
            value={formData.drivingID}
            onChange={handleInputChange}
            placeholder="Driving ID"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicle_name">Selected Vehicle:</label>
          <input
            type="text"
            id="vehicle_name"
            name="vehicle_name"
            value={formData.vehicle_name}
            onChange={handleInputChange}
            placeholder="Selected Vehicle"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicle_price">Vehicle Price:</label>
          <input
            type="number"
            id="vehicle_price"
            name="vehicle_price"
            value={formData.vehicle_price}
            onChange={handleInputChange}
            placeholder="Vehicle Price"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicle_category">Vehicle Category:</label>
          <input
            type="text"
            id="vehicle_category"
            name="vehicle_category"
            value={formData.vehicle_category}
            onChange={handleInputChange}
            placeholder="Vehicle Category"
          />
        </div>
        <div className="form-group">
          <label htmlFor="pickUpDate">Pickup Date:</label>
          <input
            type="date"
            id="pickUpDate"
            name="pickUpDate"
            value={formData.pickUpDate}
            onChange={handleInputChange}
            placeholder="Pickup Date"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dropOffDate">Drop-off Date:</label>
          <input
            type="date"
            id="dropOffDate"
            name="dropOffDate"
            value={formData.dropOffDate}
            onChange={handleInputChange}
            placeholder="Drop-off Date"
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            placeholder="Time"
          />
        </div>
        <div className="form-group">
          <label htmlFor="rentAmount">Total Paid Amount:</label>
          <input
            type="number"
            id="rentAmount"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={handleInputChange}
            placeholder="Total Paid Amount"
          />
        </div>
        {editMode ? (
          <button onClick={handleUpdate}>Update</button>
        ) : (
          <button onClick={handleAddData}>Add</button>
        )}
      </div>
      <hr />
      <div className="filter-container">
        <label htmlFor="locationFilter">Filter by Location:</label>
        <select
          id="locationFilter"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        >
          <option value="">Select Location</option>
          {getUniqueLocations().map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
        <div className="search-export-container">
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name"
            />
            <button onClick={() => setSearchQuery("")}>
              <Search />
            </button>
          </div>
          {filteredData.length != 0 && (
            <div className="export-container">
              <CSVLink data={filteredData} headers={headers}>
                <button>Export CSV</button>
              </CSVLink>
            </div>
          )}
        </div>
      </div>
      <div className="booking">
      <table className="booking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Location-Selected</th>
            <th>Phone No.</th>
            <th>Driving ID</th>
            <th>Selected Vehicle</th>
            <th>Vehicle Price</th>
            <th>Vehicle Category</th>
            <th>Pickup Date</th>
            <th>Drop-off Date</th>
            <th>Total Paid Amount</th>
            <th>DrivingID Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData
            .map((userDetails, index) => (
              <tr key={userDetails.id}>
                <td>{index + 1}</td>
                <td>{formatTime(userDetails.time)}</td>
                <td>{userDetails.name}</td>
                <td>{userDetails.email}</td>
                <td>{userDetails.address}</td>
                <td>{userDetails.userLocation}</td>
                <td>{userDetails.tel}</td>
                <td>{userDetails.drivingID}</td>
                <td>{userDetails.vehicle_name}</td>
                <td>₹{userDetails.vehicle_price}</td>
                <td>{userDetails.vehicle_category}</td>
                <td>{formatDate(userDetails.pickUpDate)}</td>
                <td>{formatDate(userDetails.dropOffDate)}</td>
                <td>₹{userDetails.rentAmount}</td>
                <tr>
                  <td>
                    <a href={userDetails.image_Url}>Click Here</a>
                  </td>
                </tr>
                <td>
                  <button onClick={() => handleEdit(userDetails.vehicle_id)}>
                    <Edit />
                  </button>
                  <button onClick={() => handleDelete(userDetails.vehicle_id)}>
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default BookingData;
