import { Account, Client } from "react-native-appwrite";

export const client = new Client()
  .setProject("6848cd84002d5db83865")
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setPlatform(".co.jaympire.habittracker");


  export const account = new Account(client);

