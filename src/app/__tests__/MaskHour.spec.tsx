import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MaskInput from "../components/MaskHour";

describe("MaskInput Component", () => {
  it("should apply mask correctly for valid times", () => {
    const mockInputMaskChange = jest.fn();
    const { getByPlaceholderText } = render(
      <MaskInput
        inputMaskChange={mockInputMaskChange}
        placeholder="Enter time"
      />
    );

    const input = getByPlaceholderText("Enter time");

    // Test valid time inputs
    fireEvent.changeText(input, "0923");
    expect(mockInputMaskChange).toHaveBeenCalledWith("09:23");

    fireEvent.changeText(input, "1545");
    expect(mockInputMaskChange).toHaveBeenCalledWith("15:45");
  });

  it("should clear the input correctly", () => {
    const mockInputMaskChange = jest.fn();
    const { getByPlaceholderText } = render(
      <MaskInput
        inputMaskChange={mockInputMaskChange}
        placeholder="Enter time"
      />
    );

    const input = getByPlaceholderText("Enter time");

    // Simulate input change with a value
    fireEvent.changeText(input, "0930");
    expect(mockInputMaskChange).toHaveBeenCalledWith("09:30");

    // Clear the input
    fireEvent.changeText(input, "");
    expect(mockInputMaskChange).toHaveBeenCalledWith("");
  });

  it("should handle different lengths of input", () => {
    const mockInputMaskChange = jest.fn();
    const { getByPlaceholderText } = render(
      <MaskInput
        inputMaskChange={mockInputMaskChange}
        placeholder="Enter time"
      />
    );

    const input = getByPlaceholderText("Enter time");

    // Test varying lengths of input
    fireEvent.changeText(input, "1");
    expect(mockInputMaskChange).toHaveBeenCalledWith("1");

    fireEvent.changeText(input, "123");
    expect(mockInputMaskChange).toHaveBeenCalledWith("12:3");

    fireEvent.changeText(input, "1234");
    expect(mockInputMaskChange).toHaveBeenCalledWith("12:34");
  });

  it("should ignore non-numeric characters", () => {
    const mockInputMaskChange = jest.fn();
    const { getByPlaceholderText } = render(
      <MaskInput
        inputMaskChange={mockInputMaskChange}
        placeholder="Enter time"
      />
    );

    const input = getByPlaceholderText("Enter time");

    // Simulate input with non-numeric characters
    fireEvent.changeText(input, "12ab34");
    expect(mockInputMaskChange).toHaveBeenCalledWith("12:34");

    fireEvent.changeText(input, "hello");
    expect(mockInputMaskChange).toHaveBeenCalledWith("");
  });

  it("should not call inputMaskChange if the value does not change", () => {
    const mockInputMaskChange = jest.fn();
    const { getByPlaceholderText } = render(
      <MaskInput
        inputMaskChange={mockInputMaskChange}
        placeholder="Enter time"
      />
    );

    const input = getByPlaceholderText("Enter time");

    // Simulate input change
    fireEvent.changeText(input, "1200");

    // Simulate the same input again
    fireEvent.changeText(input, "1200");

    // The callback should be called only once with the same value
    expect(mockInputMaskChange).toHaveBeenCalledTimes(2);
  });

  it("should apply mask correctly for inputs longer than required", () => {
    const mockInputMaskChange = jest.fn();
    const { getByPlaceholderText } = render(
      <MaskInput
        inputMaskChange={mockInputMaskChange}
        placeholder="Enter time"
      />
    );

    const input = getByPlaceholderText("Enter time");

    // Simulate input with more than 4 digits
    fireEvent.changeText(input, "123456");
    expect(mockInputMaskChange).toHaveBeenCalledWith("12:3456");
  });
});
