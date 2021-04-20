import React, { useState } from "react";
import AuthContext from "./context/auth-context";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";

import "./App.css";

function App() {
  const [state, setState] = useState({
    token: null,
    userId: null,
  });
  const login = (token, userId, tokenExpiration) => {
    setState({ token, userId });
  };

  const logout = () => {
    setState({ token: null, userId: null });
  };

  return (
    <div className="App">
      <Router>
        <AuthContext.Provider
          value={{
            token: state.token,
            userId: state.userId,
            login: login,
            logout: logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {!state.token && <Redirect exact from="/" to="/auth" />}
              {state.token && <Redirect exact from="/" to="/events" />}
              {state.token && <Redirect exact from="/auth" to="/events" />}
              {!state.token && (
                <Route exact path="/auth" component={AuthPage} />
              )}
              <Route exact path="/events" component={EventsPage} />
              {state.token && (
                <Route exact path="/bookings" component={BookingsPage} />
              )}
            </Switch>
          </main>
        </AuthContext.Provider>
      </Router>
    </div>
  );
}

export default App;
