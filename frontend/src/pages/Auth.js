import React, { useContext, useState } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";

const AuthPage = () => {
  const [isLogin, setIsLogIn] = useState(true);
  const emailEl = React.createRef();
  const passwordEl = React.createRef();
  const context = useContext(AuthContext);

  const switchModeHandler = () => {
    setIsLogIn(!isLogin);
  };

  const submitHandler = (event) => {
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(loginInput: {email: "${email}", password: "${password}"}) {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `,
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });

    event.preventDefault();
  };

  return (
    <div>
      <form className="auth-form" onSubmit={submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={switchModeHandler}>
            Switch to {isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
