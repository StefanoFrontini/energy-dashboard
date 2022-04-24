import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import { AppProvider } from "../context";
import { BrowserRouter as Router } from "react-router-dom";

test("on initial render, the submit button is disabled", () => {
  const state = {
    user: {},
    isAuthenticated: false,
    isModalOpen: false,
    modalContent: "",
  };
  render(
    <AppProvider value={state}>
      <Router>
        <LoginForm />
      </Router>
    </AppProvider>
  );
  //screen.getByRole("");
  expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
});
test("if email and password is entered, the submit button becomes enabled", () => {
  const state = {
    user: {},
    isAuthenticated: false,
    isModalOpen: false,
    modalContent: "",
  };
  render(
    <AppProvider value={state}>
      <Router>
        <LoginForm />
      </Router>
    </AppProvider>
  );
  userEvent.type(
    screen.getByRole("textbox", { name: /email/i }),
    "ste@ste.com"
  );
  userEvent.type(screen.getByRole("textbox", { name: /password/i }), "abc123");
  expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
});
