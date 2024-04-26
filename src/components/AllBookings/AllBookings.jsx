import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase"; // Ensure this path is correct
import { CSVLink } from "react-csv";
import SearchIcon from '@mui/icons-material/Search'; // Import Search icon from Material-UI
import "./AllBookings.css";

const AllBooking = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [vehicleNameFilter, setVehicleNameFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBookings = () => {
      const userDetailsRef = ref(database, "UserDetails");
      const completedBookingsRef = ref(database, "completed-bookings");

      const userDetailsPromise = new Promise((resolve) => {
        onValue(userDetailsRef, (snapshot) => {
          const userDetailsData = snapshot.val() || {};
          resolve(Object.values(userDetailsData));
        });
      });

      const completedBookingsPromise = new Promise((resolve) => {
        onValue(completedBookingsRef, (snapshot) => {
          const completedBookingsData = snapshot.val() || {};
          resolve(Object.values(completedBookingsData));
        });
      });

      Promise.all([userDetailsPromise, completedBookingsPromise]).then(
        ([userDetails, completedBookings]) => {
          const mergedData = [...userDetails, ...completedBookings];
          setTableData(mergedData);
          setFilteredData(mergedData);
        }
      );
    };

    fetchBookings();
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

  const filterData = () => {
    let filtered = tableData;

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter((booking) =>
        booking.userLocation.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    // Apply vehicle name filter
    if (vehicleNameFilter) {
      filtered = filtered.filter((booking) =>
        booking.vehicle_name.toLowerCase() === vehicleNameFilter.toLowerCase()
      );
    }

    // Apply date filter
    if (startDateFilter && endDateFilter) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.pickUpDate);
        return (
          bookingDate >= new Date(startDateFilter) &&
          bookingDate <= new Date(endDateFilter)
        );
      });
    }

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter((booking) =>
        booking.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [locationFilter, vehicleNameFilter, startDateFilter, endDateFilter, searchQuery]);

  // Get unique locations and vehicle names for dropdown options
  const uniqueLocations = Array.from(
    new Set(tableData.map((booking) => booking.userLocation))
  );
  const uniqueVehicleNames = Array.from(
    new Set(tableData.map((booking) => booking.vehicle_name))
  );

  // CSV headers
  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
    { label: "Location Selected", key: "userLocation" },
    { label: "Phone No.", key: "tel" },
    { label: "Driving ID", key: "drivingID" },
    { label: "Selected Vehicle", key: "vehicle_name" },
    { label: "Vehicle Price", key: "vehicle_price" },
    { label: "Vehicle Category", key: "vehicle_category" },
    { label: "Pickup Date", key: "pickUpDate" },
    { label: "Drop-off Date", key: "dropOffDate" },
    { label: "Total Paid Amount", key: "rentAmount" },
    { label: "Driving ID Image", key: "image_Url" },
  ];

  return (
    <>
      <div className="updated-bookings">
        <h2>ALL Bookings</h2>
        <div className="filters">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
          <select
            value={vehicleNameFilter}
            onChange={(e) => setVehicleNameFilter(e.target.value)}
          >
            <option value="">All Vehicles</option>
            {uniqueVehicleNames.map((vehicleName, index) => (
              <option key={index} value={vehicleName}>
                {vehicleName}
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
                <SearchIcon />
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
          <div className="date-filter">
            <h2>Pickup dates:</h2>
        <label>Start Date:</label>
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
          <label>End Date:</label>
          <input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          /></div>
        </div>
        <hr />
        <div className="table-container">
          <table className="booking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Location Selected</th>
                <th>Phone No.</th>
                <th>Driving ID</th>
                <th>Selected Vehicle</th>
                <th>Vehicle Price</th>
                <th>Vehicle Category</th>
                <th>Pickup Date</th>
                <th>Drop-off Date</th>
                <th>Total Paid Amount</th>
                <th>Driving ID Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((booking, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{formatTime(booking.time)}</td>
                  <td>{booking.name}</td>
                  <td>{booking.email}</td>
                  <td>{booking.address}</td>
                  <td>{booking.userLocation}</td>
                  <td>{booking.tel}</td>
                  <td>{booking.drivingID}</td>
                  <td>{booking.vehicle_name}</td>
                  <td>₹{booking.vehicle_price}</td>
                  <td>{booking.vehicle_category}</td>
                  <td>{formatDate(booking.pickUpDate)}</td>
                  <td>{formatDate(booking.dropOffDate)}</td>
                  <td>₹{booking.rentAmount}</td>
                  <td>
                    <a href={booking.image_Url}>Click Here</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllBooking;
