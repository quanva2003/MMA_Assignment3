import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const FavoriteScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  const fetchFavorites = async () => {
    try {
      const currentFavorites = await AsyncStorage.getItem("favorites");
      const favoritesArray = currentFavorites
        ? JSON.parse(currentFavorites)
        : [];
      console.log(favoritesArray);
      setFavorites(favoritesArray);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const navigateToDetails = (perfume) => {
    navigation.navigate("Details", { perfume });
  };

  const removeFromFavorites = async (perfumeId) => {
    try {
      const currentFavorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = currentFavorites ? JSON.parse(currentFavorites) : [];
      favoritesArray = favoritesArray.filter((item) => item.id !== perfumeId);
      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
      setFavorites(favoritesArray);
      Alert.alert("Success", "Removed from favorites");
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const confirmRemoveFromFavorites = (perfumeId) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to remove this perfume from favorites?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => removeFromFavorites(perfumeId) },
      ]
    );
  };

  const clearFavorites = async () => {
    try {
      await AsyncStorage.removeItem("favorites");
      setFavorites([]);
      Alert.alert("Success", "Cleared all favorites");
    } catch (error) {
      console.error("Error clearing favorites:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Perfumes</Text>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {favorites.length > 0 ? (
          favorites.map((perfume, index) => (
            <View key={index} style={styles.perfumeContainer}>
              <View style={styles.perfumeDetail}>
                <Image
                  source={{ uri: perfume.image }}
                  style={styles.perfumeImage}
                />
                <View style={styles.perfumeTitle}>
                  <TouchableOpacity onPress={() => navigateToDetails(perfume)}>
                    <Text style={styles.perfumeName}>
                      {perfume.perfumeName}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.price}>Price: ${perfume.price}</Text>
                </View>
                <Button
                  onPress={() => confirmRemoveFromFavorites(perfume.id)}
                  buttonStyle={styles.removeButton}
                  titleStyle={{ color: "red" }}
                  icon={<Icon type="antdesign" name="delete" color={"red"} />}
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>No favorite perfumes added.</Text>
        )}
      </ScrollView>
      {favorites.length > 0 && (
        <Button
          title="Clear All"
          onPress={() =>
            Alert.alert(
              "Confirm",
              "Are you sure you want to remove all favorites?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: clearFavorites },
              ]
            )
          }
          buttonStyle={styles.clearButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  perfumeContainer: {
    width: "100%",
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    alignItems: "center",
  },
  perfumeImage: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderRadius: 8,
  },
  perfumeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    height: 40,
  },
  price: {
    fontSize: 16,
    color: "green",
  },
  removeButton: {
    backgroundColor: "white",
    marginTop: 10,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 50,
  },
  clearButton: {
    backgroundColor: "red",
    marginBottom: 20,
    borderRadius: 50,
    width: 100,
    alignSelf: "center",
  },
  emptyMessage: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  perfumeDetail: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  perfumeTitle: {
    display: "flex",
    flexDirection: "column",
    width: 180,
  },
});

export default FavoriteScreen;
