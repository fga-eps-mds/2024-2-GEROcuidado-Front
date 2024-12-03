import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

interface Props {
  title: string;
  callbackFn: () => unknown;
  backgroundColor?: string;
  showLoading?: boolean;
}

export default function ForgetButton({
  title,
  callbackFn,
  backgroundColor,
  showLoading,
}: Readonly<Props>) {
  const background = backgroundColor ?? "#2CCDB5";

  return (
    <Pressable
      testID="customButtonId"
      style={styles(background).button}
      onPress={() => callbackFn()}
    >
      {showLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles(background).buttonText}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = (backgroundColor: string) =>
  StyleSheet.create({
    buttonText: {
      fontSize: 13,
      color: "white",
      fontWeight: "300",
    },
    button: {
      width: "30%",
      maxWidth: 150,
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor,
      alignItems: "center",
      borderRadius: 15,
    },
  });
