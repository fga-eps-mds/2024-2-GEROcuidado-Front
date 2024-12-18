import React from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { View } from 'react-native';

interface Props {
  title: string;
  showLoading?: boolean;
}

export default function ForgetButton({
  title,
  showLoading,
}: Readonly<Props>) {

  const handlePress = () => {
    router.push("/private/pages/esqueciSenha"); 
  };

  return (
    <View>
      {showLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Text
          style={styles.linkText}
          onPress={handlePress}
        >
          {title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    linkText: {
      width: "40%",
      color: "#2CCDB5",
      maxWidth: 300,
      textDecorationLine: "underline",
      paddingVertical: 12,
      paddingHorizontal: 18,
      textAlign: "left",
      borderRadius: 20,
    },
  });
