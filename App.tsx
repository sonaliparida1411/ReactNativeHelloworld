
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';

const App = () => {
  console.log("APP STARTED");

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [taskDate, setTaskDate] = useState("");
  useEffect(() => {
    getTodos();
  }, []);
    const addTodo = async () => {
  try {
    if (title.trim() === '' || taskDate.trim() === '') {
      console.log("Title or date missing");
      return;
    }

    await axios.post('http://localhost:5000/api/todos', {
      title: title,
      task_date: taskDate, // ✅ use user input
    });

    setTitle('');
    setTaskDate(''); // ✅ clear date field
    getTodos();

  } catch (error) {
    console.log(error);
  }
};
    
  const deleteTodo = async (id: number) => {
  try {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    getTodos();
  } catch (error) {
    console.log(error);
  }
};
const editTodo = (todo: any) => {
  setTitle(todo.title);
  setTaskDate(todo.task_date.split("T")[0]);
  setEditingId(todo.id);
};
const updateTodo = async () => {
  try {
    if (title.trim() === ''|| taskDate.trim() === '') {
      return;
    }

    await axios.put(
      `http://localhost:5000/api/todos/${editingId}`,
      {
        title: title,
        completed: false,
        task_date: taskDate, // ✅ use user input
      }
    );

  

    setTitle('');
    setTaskDate('');
    setEditingId(null);

    getTodos();

  } catch (error) {
    console.log(error);
  }
};


  const getTodos = async () => {
  console.log("getTodos called");

  try {
    const response = await axios.get(
      "http://localhost:5000/api/todos"
    );

    console.log("Todos:", response.data);

    setTodos(response.data);

  } catch (error: any) {
    console.log("GET ERROR:", error.message);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Todo App</Text>
      <TextInput
  style={styles.input}
  placeholder="Enter a new todo"
  value={title}
  onChangeText={setTitle}
/>
<Calendar
  onDayPress={(day) => {
    setTaskDate(day.dateString);
  }}
  markedDates={{
    [taskDate]: {
      selected: true,
      selectedColor: "#2196F3",
    },
  }}
/>

<Text
  style={{
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
    fontWeight: "bold",
  }}
>
  Selected Date: {taskDate || "No date selected"}
</Text>
<TouchableOpacity
  style={styles.button}
  onPress={
    editingId ? updateTodo : addTodo
  }
>
  <Text style={styles.buttonText}>
    {editingId ? "Update Todo" : "Add Todo"}
  </Text>
</TouchableOpacity>




      <FlatList
        data={todos}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Text style={{fontSize:18,fontWeight:'bold'}}>
  {item.title}
</Text>

<Text>
  {item.completed ? "✅ Completed" : "⏳ Pending"}
</Text>
<Text>
  📅 {item.task_date?.split("T")[0]}
</Text>
<TouchableOpacity
  style={styles.deleteButton}
  onPress={() => deleteTodo(item.id)}
>
  <Text style={styles.deleteButtonText}>
    🗑 Delete
  </Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.editButton}
  onPress={() => editTodo(item)}
>
  <Text style={styles.editButtonText}>
    ✏️ Edit
  </Text>
</TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  padding: 12,
  marginBottom: 10,
},

button: {
  backgroundColor: '#2196F3',
  padding: 15,
  borderRadius: 10,
  marginBottom: 20,
},

buttonText: {
  color: '#fff',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 18,
},
deleteButton: {
  backgroundColor: "#973a33",
  padding: 10,
  marginTop: 10,
  borderRadius: 8,
},

deleteButtonText: {
  color: "#fff",
  textAlign: "center",
  fontWeight: "bold",
},
editButton: {
  backgroundColor: '#d9c27e',
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
},

editButtonText: {
  color: '#000',
  textAlign: 'center',
  fontWeight: 'bold',
},
});

export default App