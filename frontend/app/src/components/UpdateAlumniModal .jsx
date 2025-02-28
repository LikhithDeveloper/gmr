import React, { useState, useEffect } from "react";

const UpdateAlumniModal = ({ show, handleClose, alumniId }) => {
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    company: "",
    expertise: "",
    industry: "",
    education: [],
    experience: [],
    achievements: "",
    successStory: "",
    accept: false,
    imageUrl: "",
    bio: "",
    messagesProfiles: [],
  });

  // Fetch alumni details when the modal opens
  useEffect(() => {
    if (show && alumniId) {
      fetch(`http://localhost:3000/alumni/${alumniId}`)
        .then((response) => response.json())
        .then((data) => {
          // Exclude email, password, and phone from being set in the form
          const { email, password, phone, ...editableData } = data;
          setFormData(editableData);
        })
        .catch((error) => console.error("Error fetching alumni:", error));
    }
  }, [show, alumniId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/alumni/${alumniId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update alumni");
      }

      const updatedData = await response.json();
      alert("Alumni updated successfully!");
      handleClose(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating alumni:", error);
      alert("Error updating alumni. Try again!");
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
            <h5 className="modal-title">Update Alumni</h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Batch</label>
                <input
                  type="number"
                  className="form-control"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Expertise (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  name="expertise"
                  value={formData.expertise.join(",")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expertise: e.target.value.split(","),
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  className="form-control"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Achievements (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  name="achievements"
                  value={formData.achievements.join(",")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      achievements: e.target.value.split(","),
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Success Story</label>
                <textarea
                  className="form-control"
                  name="successStory"
                  value={formData.successStory}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  className="form-control"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="accept"
                  checked={formData.accept}
                  onChange={handleChange}
                />
                <label className="form-check-label">Accept</label>
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

export default UpdateAlumniModal;
