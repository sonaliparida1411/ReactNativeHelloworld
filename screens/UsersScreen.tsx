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

const UsersScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5050/api/admin/users",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setUsers(response.data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.delete(
        `http://localhost:5050/api/admin/users/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      Alert.alert("Success", "User Deleted Successfully");

      getUsers();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>👥 All Users</Text>

      <FlatList
        data={users}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>

            <Text>{item.email}</Text>

            <Text style={{ marginBottom: 10 }}>
              Role: {item.role}
            </Text>

            {item.role === "admin" ? (
              <Text style={styles.adminText}>
                👑 Admin (Cannot Delete)
              </Text>
            ) : (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteUser(item.id)}
              >
                <Text style={styles.deleteText}>
                  🗑 Delete User
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default UsersScreen;

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

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
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

  adminText: {
    color: "green",
    fontWeight: "bold",
    marginTop: 10,
  },
});