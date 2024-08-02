"use client";

import { useContext, useState, useEffect } from 'react';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [routineName, setRoutineName] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('token');
      setToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchWorkoutsAndRoutines = async () => {
      try {
        if (token) {
          console.log('Fetching workouts and routines with token:', token);

          const [workoutsResponse, routinesResponse] = await Promise.all([
            axios.get('http://localhost:8000/workouts/workouts', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:8000/routines', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          console.log('Workouts response:', workoutsResponse.data);
          console.log('Routines response:', routinesResponse.data);

          setWorkouts(workoutsResponse.data);
          setRoutines(routinesResponse.data);
        } else {
          console.error('No token available');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchWorkoutsAndRoutines();
  }, [token]);

  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/workouts', {
        name: workoutName,
        description: workoutDescription,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts([...workouts, response.data]);
      setWorkoutName('');
      setWorkoutDescription('');
    } catch (error) {
      console.error('Failed to create workout:', error);
    }
  };

  const handleCreateRoutine = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/routines', {
        name: routineName,
        description: routineDescription,
        workouts: selectedWorkouts,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutineName('');
      setRoutineDescription('');
      setSelectedWorkouts([]);
      const routinesResponse = await axios.get('http://localhost:8000/routines', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutines(routinesResponse.data);
    } catch (error) {
      console.error('Failed to create routine:', error);
    }
  };

  const handleDeleteRoutine = async (routineId) => {
    try {
      await axios.delete(`http://localhost:8000/routines/${routineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutines(routines.filter(routine => routine.id !== routineId));
    } catch (error) {
      console.error('Failed to delete routine:', error);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await axios.delete(`http://localhost:8000/workouts/${workoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(workouts.filter(workout => workout.id !== workoutId));
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <header className="header">
          <h1>Welcome!</h1>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </header>

        <div className="accordion mt-5 mb-5" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button custom-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Create Workout
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateWorkout} className="form-style">
                  <div className="mb-3">
                    <label htmlFor="workoutName" className="form-label">Workout Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutName"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutDescription" className="form-label">Workout Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutDescription"
                      value={workoutDescription}
                      onChange={(e) => setWorkoutDescription(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Create Workout</button>
                </form>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button custom-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Create Routine
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateRoutine} className="form-style">
                  <div className="mb-3">
                    <label htmlFor="routineName" className="form-label">Routine Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineName"
                      value={routineName}
                      onChange={(e) => setRoutineName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="routineDescription" className="form-label">Routine Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineDescription"
                      value={routineDescription}
                      onChange={(e) => setRoutineDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutSelect" className="form-label">Select Workouts</label>
                    <select
                      multiple
                      className="form-control"
                      id="workoutSelect"
                      value={selectedWorkouts}
                      onChange={(e) => setSelectedWorkouts([...e.target.selectedOptions].map(option => option.value))}
                    >
                      {workouts.map(workout => (
                        <option key={workout.id} value={workout.id}>
                          {workout.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Create Routine</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <section className="workout-section">
          <h3>Your Workouts:</h3>
          <ul>
            {workouts.length === 0 ? (
              <li>No workouts found.</li>
            ) : (
              workouts.map(workout => (
                <div className="card custom-card" key={workout.id}>
                  <div className="card-body">
                    <h5 className="card-title">{workout.name}</h5>
                    <p className="card-text">{workout.description}</p>
                    <button onClick={() => handleDeleteWorkout(workout.id)} className="btn btn-danger">
                      Delete Workout
                    </button>
                  </div>
                </div>
              ))
            )}
          </ul>
        </section>

        <section className="routine-section">
          <h3>Your Routines:</h3>
          <ul>
            {routines.length === 0 ? (
              <li>No routines found.</li>
            ) : (
              routines.map(routine => (
                <div className="card custom-card" key={routine.id}>
                  <div className="card-body">
                    <h5 className="card-title">{routine.name}</h5>
                    <p className="card-text">{routine.description}</p>
                    <ul className="card-text">
                      {routine.workouts && routine.workouts.length > 0 ? (
                        routine.workouts.map(workout => (
                          <li key={workout.id}>
                            {workout.name}: {workout.description}
                          </li>
                        ))
                      ) : (
                        <li>No workouts in this routine.</li>
                      )}
                    </ul>
                    <button onClick={() => handleDeleteRoutine(routine.id)} className="btn btn-danger">
                      Delete Routine
                    </button>
                  </div>
                </div>
              ))
            )}
          </ul>
        </section>
      </div>

      <style jsx>{`
        .container {
          background-color: #000;
          color: #fff;
          min-height: 100vh;
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .accordion-button.custom-button {
          background-color: #00bcd4;
          color: #fff;
          border: none;
          font-weight: bold;
        }

        .accordion-button.custom-button:focus {
          box-shadow: none;
        }

        .accordion-button.custom-button:not(.collapsed) {
          background-color: #0097a7;
          color: #fff;
        }

        .form-style {
          background-color: #212121;
          padding: 20px;
          border-radius: 8px;
        }

        .form-label {
          color: #00bcd4;
        }

        .form-control {
          background-color: #333;
          color: #fff;
          border: 1px solid #00bcd4;
        }

        .form-control:focus {
          border-color: #00bcd4;
          box-shadow: 0 0 0 0.2rem rgba(0, 188, 212, 0.25);
        }

        .btn-primary {
          background-color: #00bcd4;
          border-color: #00bcd4;
        }

        .btn-primary:hover {
          background-color: #0097a7;
          border-color: #0097a7;
        }

        .btn-danger {
          background-color: #f44336;
          border-color: #f44336;
        }

        .btn-danger:hover {
          background-color: #d32f2f;
          border-color: #d32f2f;
        }

        .custom-card {
          background-color: #424242;
          border: 1px solid #00bcd4;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .card-body {
          padding: 20px;
        }

        .card-title {
          color: #00bcd4;
        }

        .card-text {
          color: #e0e0e0;
        }

        .workout-section,
        .routine-section {
          margin-top: 30px;
        }
      `}</style>
    </ProtectedRoute>
  );
};

export default Home;

