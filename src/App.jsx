
import { useState, useEffect } from "react";
import "./App.css";

const App_url=`https://backend-production-f4b98.up.railway.app/`;

function App() {
  const [students, setStudents] = useState([]);

  const [fromdata, setFormData] = useState({
    name: "",
    email: "",
    course: "",
  });

  // Store the ID of the student being edited
  const [editId, setEditId] = useState(null);

  // =========================
  // GET STUDENTS
  // =========================
  const getstudent = () => {
    fetch(`${App_url}/student`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  useEffect(() => {
    getstudent();
  }, []);

  // =========================
  // ADD / UPDATE STUDENT
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check empty fields
    if (!fromdata.name || !fromdata.email || !fromdata.course) {
      alert("Please fill all fields");
      return;
    }

    // =========================
    // ADD STUDENT
    // =========================
    if (editId === null) {
      fetch(`${App_url}/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fromdata),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add student");
          }
          return response.json();
        })
        .then((data) => {
          setStudents([...students, data]);

          setFormData({
            name: "",
            email: "",
            course: "",
          });

          alert("Student added successfully!");
        })
        .catch((error) => {
          console.log("Error:", error);
          alert("Failed to add student");
        });
    }

    // =========================
    // UPDATE STUDENT
    // =========================
    else {
      fetch(`http://localhost:3000/student/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fromdata),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update student");
          }
          return response.json();
        })
        .then((data) => {
          setStudents(
            students.map((student) =>
              student._id === editId ? data : student
            )
          );

          setFormData({
            name: "",
            email: "",
            course: "",
          });

          setEditId(null);

          alert("Student updated successfully!");
        })
        .catch((error) => {
          console.log("Error:", error);
          alert("Failed to update student");
        });
    }
  };

  // =========================
  // FORM INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...fromdata,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // DELETE STUDENT
  // =========================
  const handleDelete = (id) => {
    const deleteStudent = confirm(
      "Are you sure you want to delete the student data?"
    );

    if (!deleteStudent) {
      return;
    }

    fetch(`http://localhost:3000/student/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete student");
        }
        return response.json();
      })
      .then(() => {
        setStudents(
          students.filter((student) => student._id !== id)
        );

        alert("Student deleted successfully!");
      })
      .catch((error) => {
        console.log("Error:", error);
        alert("Failed to delete student");
      });
  };

  // =========================
  // START EDIT
  // =========================
  const handleEdit = (student) => {
    setEditId(student._id);

    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
    });
  };

  return (
    <>
      <h1>Student Management System</h1>
  
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={fromdata.name}
          placeholder="Enter your name"
          onChange={handleChange}
        />
  
        <input
          type="email"
          name="email"
          value={fromdata.email}
          placeholder="Enter your email"
          onChange={handleChange}
        />
  
        <input
          type="text"
          name="course"
          value={fromdata.course}
          placeholder="Enter your course"
          onChange={handleChange}
        />
  
        <button type="submit">
          {editId === null ? "Add Student" : "Update Student"}
        </button>
      </form>
  
      {students.map((student) => (
        <div key={student._id}>
          <p>{student.name}</p>
          <p>{student.email}</p>
          <p>{student.course}</p>
  
          <button onClick={() => handleEdit(student)}>
            Edit
          </button>
  
          <button onClick={() => handleDelete(student._id)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
}

export default App;

