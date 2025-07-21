import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, push, set, remove } from "firebase/database";
import { database } from "../../firebase";
import "./BookingData.css";
import { Edit, Delete, Search } from "@mui/icons-material";
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
    vehicleNumber: "",
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
  const [filterCategory, setFilterCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPickupDate, setFilterPickupDate] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    const dbRef = ref(database);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userDetailsArray = Object.entries(data.UserDetails || {}).map(
          ([key, value]) => ({ id: key, ...value })
        );
        setTableData(userDetailsArray);
      }
    });
  }, []);

  useEffect(() => {
    let data = [...tableData];
    if (filterLocation) {
      data = data.filter((user) => user.userLocation === filterLocation);
    }
    if (filterCategory) {
      data = data.filter((user) => user.vehicle_category === filterCategory);
    }
    if (searchQuery) {
      data = data.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterPickupDate) {
      data = data.filter((user) => user.pickUpDate === filterPickupDate);
    }
    setFilteredData(data);
  }, [
    filterLocation,
    filterCategory,
    searchQuery,
    filterPickupDate,
    tableData,
  ]);

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
      vehicleNumber: "",
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
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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
      vehicleNumber: "",
      pickUpDate: "",
      dropOffDate: "",
      time: "",
      rentAmount: "",
      image_Url: "",
      vehicle_id: "",
    });
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete?");
    if (shouldDelete) {
      await remove(ref(database, `UserDetails/${id}`));
    }
  };

  const handleClearEmptyRows = async () => {
    const cleanedData = tableData.filter((user) => {
      const fields = Object.values(user);
      const emptyFieldCount = fields.filter(
        (field) => !field || (typeof field === "string" && field.trim() === "")
      ).length;

      return emptyFieldCount < 2;
    });

    setTableData(cleanedData);
    setFilteredData(cleanedData);

    // Update the data in Firebase
    const dbRef = ref(database, "UserDetails");
    await set(dbRef, cleanedData);

    alert(
      `${
        tableData.length - cleanedData.length
      } rows with empty data were removed!`
    );
  };

  const formatTime = (timeString) => {
    if (!timeString || timeString.indexOf(":") === -1) {
      return ""; // Return empty string if time is not available or not in correct format
    }

    const timeParts = timeString.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // Handle invalid hour or minute values
    if (isNaN(hours) || isNaN(minutes)) {
      return "";
    }

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
    { label: "Vehicle Number", key: "vehicleNumber" },
    { label: "Pickup Date", key: "pickUpDate" },
    { label: "Dropoff Date", key: "dropOffDate" },
    { label: "Pickup Time", key: "time" },
    { label: "Rent Amount", key: "rentAmount" },
    { label: "Image URL", key: "image_Url" },
    { label: "Vehicle ID", key: "vehicle_id" },
  ];
  return (
    <div className="booking-data-container">
      <h2 className="booking-data-title">Booking Data:</h2>
      <div className="form-container" ref={formRef}>
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
          <select
            id="vehicle_category"
            name="vehicle_category"
            value={formData.vehicle_category}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="Scooty">Scooty</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="vehicleNumber">Vehicle Number:</label>
          <input
            type="text"
            id="vehicleNumber"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleInputChange}
            placeholder="Vehicle Number"
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
          <option value="">All</option>
          {getUniqueLocations().map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Scooty">Scooty</option>
          <option value="Bike">Bike</option>
          <option value="Car">Car</option>
        </select>

        <div className="pickup-filter">
          <label htmlFor="pickupDateFilter">Filter by Pickup Date:</label>
          <input
            type="date"
            id="pickupDateFilter"
            value={filterPickupDate}
            onChange={(e) => setFilterPickupDate(e.target.value)}
          />
        </div>
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
          {filteredData.length !== 0 && (
            <div className="export-container">
              <CSVLink data={filteredData} headers={headers}>
                <button>Export CSV</button>
              </CSVLink>
            </div>
          )}
        </div>
        <div className="action-buttons">
          <button className="clear-btn" onClick={handleClearEmptyRows}>
            Clear Empty Data
          </button>
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
              <th>Vehicle Number</th>
              <th>Pickup Date</th>
              <th>Drop-off Date</th>
              <th>Total Paid Amount</th>
              <th>DrivingID Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((userDetails, index) => (
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
                <td>{userDetails.vehicleNumber}</td>
                <td>{formatDate(userDetails.pickUpDate)}</td>
                <td>{formatDate(userDetails.dropOffDate)}</td>
                <td>₹{userDetails.rentAmount}</td>
                <tr>
                  <td>
                    <a href={userDetails.image_Url}>Click Here</a>
                  </td>
                </tr>
                <td>
                  <button onClick={() => handleEdit(userDetails.id)}>
                    <Edit />
                  </button>
                  <button onClick={() => handleDelete(userDetails.id)}>
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
