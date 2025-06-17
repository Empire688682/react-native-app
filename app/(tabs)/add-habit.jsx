import { useAuthContext } from "@/lib/AuthContext";
import { useState } from "react";
import {View, StyleSheet} from "react-native";
import axios from "axios";
import { TextInput, SegmentedButtons, Button, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";

export default function AddHabit() {
  const {user, getUserHabits} = useAuthContext();
  const frequencies = ["daily", "weekly", "monthly"];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  const showToast = (message) =>{
    setSnackBarMessage(message);
    setShowSnackBar(true);
  }

  //create habit
  const createHabit = async()=>{
    if(!title || !description || !frequency || !user?.id){
      showToast("All field are required!")
      return
    }
    const habitData = {
      title:title,
      description:description,
      frequency:frequency,
      userId:user?.id
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        process.env.EXPO_PUBLIC_API_URL + "habit/create",
        habitData
      );

      if(response.status === 201){
        setTitle("");
        setDescription("");
        setFrequency("daily");
        showToast("Habit Added");
        getUserHabits();
        router.push("/")
      }
      
    } catch (error) {
      console.log("Error:", error);
      showToast(error.response.data.error || "An error occured");
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput label="Title" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
      <TextInput label="Description" value={description} onChangeText={setDescription} mode="outlined" style={styles.input} />
      <View>
        <SegmentedButtons
          value={frequency}
          onValueChange={(value)=>setFrequency(value)}
          buttons={frequencies.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
          style={styles.segmentedButtons}
          labelStyle={{ color: "green" }}
          theme={{
            colors: {
              onSurface: "black",
              onPrimary: "white",
              primary: "green",
            },
          }}
        />
        <Button 
        onPress={createHabit} 
        loading={isLoading}
        disabled={!title || !description} 
        theme={{ colors: {onPrimary:"white"} }} 
        style={styles.button} 
        mode="contained"
        >{isLoading? "Proccessing...":"Add habit"}</Button>

      </View>
      <Snackbar 
       duration={3000}
       visible={showSnackBar}
       onDismiss={
        ()=>setShowSnackBar(false)
      }
      action={{
        textColor:"red",
        label:"Dismiss",
        onPress:()=>setShowSnackBar(false)
      }}
      >
        {snackBarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#f8f9fa',
    padding: 10
  },
  input: {
    color: "yellow",
    marginBottom: 10
  },
  segmentedButtons: {
    color: "black",
    marginTop: 8
  },
  button: {
    marginTop: 10,
    backgroundColor: "green",
  }
});