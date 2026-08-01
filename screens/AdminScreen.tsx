import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UsersScreen from "./UsersScreen";
import TodosScreen from "./TodosScreen";

const AdminScreen = () => {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
  });

  const [showUsers, setShowUsers] = useState(false);
  const [showTodos, setShowTodos] = useState(false);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5050/api/admin/dashboard",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setDashboard(response.data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  if (showUsers) {
    return <UsersScreen />;
  }

  if (showTodos) {
    return <TodosScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>👑 Admin Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.text}>
          👥 Total Users: {dashboard.totalUsers}
        </Text>

        <Text style={styles.text}>
          📝 Total Todos: {dashboard.totalTodos}
        </Text>

        <Text style={styles.text}>
          ✅ Completed Todos: {dashboard.completedTodos}
        </Text>

        <Text style={styles.text}>
          ⏳ Pending Todos: {dashboard.pendingTodos}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowUsers(true)}
        >
          <Text style={styles.buttonText}>
            👥 View All Users
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowTodos(true)}
        >
          <Text style={styles.buttonText}>
            📝 View All Todos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },

  text: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});