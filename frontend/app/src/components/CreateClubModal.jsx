import React, { useState } from "react";

const CreateClubModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    club: "",
    mentor: "",
    users: "",
    meetDate: "", // Added a separate state for the date field
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/clubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData, // Send users as a string
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create club");
      }

      const data = await response.json();
      alert("Club created successfully!");
      handleClose(); // Close modal after submission
    } catch (error) {
      console.error("Error creating club:", error);
      alert("Error creating club. Try again!");
    }
  };

  return (
    <div
      className={`modal ${show ? "show d-block" : "d-none"}`}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Club</h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Club Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mentor</label>
                <input
                  type="text"
                  className="form-control"
                  name="mentor"
                  value={formData.mentor}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Meet Link</label>
                <input
                  type="text"
                  className="form-control"
                  name="users"
                  value={formData.users}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Meeting Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="meetDate"
                  value={formData.meetDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
              <button
                type="button"
                className="btn btn-secondary ml-2"
                onClick={handleClose}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClubModal;
