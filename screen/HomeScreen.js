import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { Icon, Button } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [perfumeData, setPerfumeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [priceFilter, setPriceFilter] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get("https://66727f616ca902ae11b07742.mockapi.io/watches")
      .then((response) => {
        setPerfumeData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const currentFavorites = await AsyncStorage.getItem("favorites");
          const favoritesArray = currentFavorites
            ? JSON.parse(currentFavorites)
            : [];
          setFavorites(favoritesArray);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };

      fetchFavorites();
    }, [])
  );

  useEffect(() => {
    if (priceFilter === null) {
      setFilteredData(perfumeData);
    } else if (priceFilter === "<100") {
      setFilteredData(perfumeData.filter((perfume) => perfume.price < 100));
    } else if (priceFilter === "<200") {
      setFilteredData(perfumeData.filter((perfume) => perfume.price < 200));
    } else if (priceFilter === ">200") {
      setFilteredData(perfumeData.filter((perfume) => perfume.price > 200));
    }
  }, [priceFilter, perfumeData]);

  const navigateToDetails = (perfume) => {
    navigation.navigate("Details", { perfume });
  };

  const saveToFavorites = async (perfume) => {
    try {
      const currentFavorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = currentFavorites ? JSON.parse(currentFavorites) : [];

      const alreadyFavorite = favoritesArray.some(
        (item) => item.id === perfume.id
      );

      if (!alreadyFavorite) {
        favoritesArray.push(perfume);
        await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
        setFavorites(favoritesArray);
        Alert.alert("Success", "Added to favorites");
      } else {
        favoritesArray = favoritesArray.filter(
          (item) => item.id !== perfume.id
        );
        await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
        setFavorites(favoritesArray);
        Alert.alert("Info", "Removed from favorites");
      }
    } catch (error) {
      console.error("Error saving to favorites:", error);
    }
  };

  const isFavorite = (perfumeId) => {
    return favorites.some((item) => item.id === perfumeId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfume List</Text>
      <View style={styles.filterContainer}>
        <Button
          title="All"
          onPress={() => setPriceFilter(null)}
          buttonStyle={styles.filterButton}
        />
        <Button
          title="< $100"
          onPress={() => setPriceFilter("<100")}
          buttonStyle={styles.filterButton}
        />
        <Button
          title="< $200"
          onPress={() => setPriceFilter("<200")}
          buttonStyle={styles.filterButton}
        />
        <Button
          title="> $200"
          onPress={() => setPriceFilter(">200")}
          buttonStyle={styles.filterButton}
        />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.grid}>
            {filteredData.map((perfume, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                duration={1000}
                style={styles.perfumeContainer}
              >
                <TouchableOpacity onPress={() => navigateToDetails(perfume)}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: perfume.image }}
                      style={styles.perfumeImage}
                      onError={() => console.log("Error loading image")}
                    />
                    <TouchableOpacity
                      style={styles.heartIcon}
                      onPress={() => saveToFavorites(perfume)}
                    >
                      <Icon
                        name="heart"
                        type="font-awesome"
                        color={isFavorite(perfume.id) ? "#f00" : "#fff"}
                        size={15}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.perfumeName}>{perfume.perfumeName}</Text>
                  <Text style={styles.price}>Price: ${perfume.price}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        )}
      </ScrollView>
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 8,
    borderRadius: 50,
    borderStyle: "solid",
    borderWidth: 1.2,
    borderColor: "black",
    backgroundColor: "gray",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  perfumeContainer: {
    width: "48%",
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  },
  imageContainer: {
    position: "relative",
  },
  perfumeImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
  },
  heartIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 50,
    backgroundColor: "#ccc",
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
});

export default HomeScreen;
