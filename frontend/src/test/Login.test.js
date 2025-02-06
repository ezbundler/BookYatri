import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/Login";




test('should login button be present', () => { 

render( <LoginPage/>);
    const loginButton = screen.getByText(/login/i);
    expect(loginButton).toBeInTheDocument();
 })