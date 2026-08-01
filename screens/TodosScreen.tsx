import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TodosScreen = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5050/api/admin/todos",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setTodos(response.data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.delete(
        `http://localhost:5050/api/admin/todos/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      Alert.alert("Success", "Todo Deleted Successfully");

      getTodos();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📝 All Todos</Text>

      <FlatList
        data={todos}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              {item.title}
            </Text>

            <Text>👤 {item.name}</Text>

            <Text>📧 {item.email}</Text>

            <Text>
              📅 {item.task_date?.split("T")[0]}
            </Text>

            <Text>
              {item.completed ? "✅ Completed" : "⏳ Pending"}
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTodo(item.id)}
            >
              <Text style={styles.deleteText}>
                🗑 Delete Todo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default TodosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  deleteButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  deleteText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});