import axios from "axios";
import { useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";

export default function Dashboard() {
  const [hasToken, setHastToken] = useState(false);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    let headers = {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + user.token,
    };
    axios
      .get("/api/v1/event/refresh-token", { headers })
      .then((res) => {
        if (res.status === 200) {
          setHastToken(true);
        } else {
          setHastToken(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const responseGoogle = (response) => {
    const user = JSON.parse(localStorage.getItem("user"));

    let headers = {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + user.token,
    };
    const { code } = response;
    axios
      .post("/api/v1/event/create-token", { code }, { headers })
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const errorGoogle = (error) => {
    console.log(error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    let headers = {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + user.token,
    };
    axios
      .post(
        "/api/v1/event/create-event",
        {
          summary,
          description,
          location,
          startDateTime,
          endDateTime,
        },
        { headers }
      )
      .then((resp) => {
        console.log(resp.data);
        setSummary("");
        setDescription("");
        setLocation("");
        setStartDateTime("");
        setEndDateTime("");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      {!hasToken ? (
        <GoogleLogin
          clientId="278325772413-vjid23ihntsjd7k6ts480g75c8u8od3f.apps.googleusercontent.com"
          buttonText="Login and Authorized Google Calender"
          onSuccess={responseGoogle}
          onFailure={errorGoogle}
          cookiePolicy="single_host_origin"
          responseType="code"
          accessType="offline"
          scope="openid email profile https://www.googleapis.com/auth/calendar"
        ></GoogleLogin>
      ) : (
        <div>
          <div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="summary">Summary</label>
              <br />
              <textarea
                type="text"
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <br />

              <label htmlFor="description">Description</label>
              <br />
              <textarea
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <br />

              <label htmlFor="location">Location</label>
              <br />
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <br />

              <label htmlFor="startDateTime">Start Date and Time</label>
              <br />
              <input
                type="datetime-local"
                id="summary"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              />
              <br />
              <label htmlFor="endDateTime">End Date and Time</label>
              <br />
              <input
                type="datetime-local"
                id="summary"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
              />
              <br />

              <button type="submit">Create Event</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
