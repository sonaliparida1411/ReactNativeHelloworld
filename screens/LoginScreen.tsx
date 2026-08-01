import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ onLogin, onRegister }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5050/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      const role = response.data.user.role;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("role", role);

      Alert.alert("Success", "Login Successful");

      onLogin(role);

    } 
    catch (error: any) {
  console.log("LOGIN ERROR:", error.response?.data);
  console.log("STATUS:", error.response?.status);
  console.log("MESSAGE:", error.message);

  Alert.alert(
    "Error",
    JSON.stringify(error.response?.data) || error.message
  );
}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={login}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRegister}>
  <Text
    style={{
      textAlign: "center",
      marginTop: 20,
      color: "#2196F3",
      fontSize: 16,
      fontWeight: "bold",
    }}
  >
    Create New Account
  </Text>
</TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});