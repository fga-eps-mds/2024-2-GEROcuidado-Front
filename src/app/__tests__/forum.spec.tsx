import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Forum from "../private/tabs/forum";
import { getAllPublicacao } from "../services/forum.service";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useNavigation } from '@react-navigation/native';

describe("Forum", () => {
  it("renderiza corretamente", async () => {
    await waitFor(() => render(<Forum />));
  });
});
