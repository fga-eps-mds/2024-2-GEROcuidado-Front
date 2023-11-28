import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import Rotina from "../private/pages/editarRotina";

describe("Cadastrar Rotina component", () => {
  it("renderiza corretamente", async () => {
    await waitFor(() => render(<Rotina />));
  });
});
