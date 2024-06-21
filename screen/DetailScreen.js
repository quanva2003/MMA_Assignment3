import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Rating, Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const DetailScreen = ({ route }) => {
  const { perfume } = route.params;
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    try {
      const currentFavorites = await AsyncStorage.getItem("favorites");
      if (currentFavorites) {
        const favoritesArray = JSON.parse(currentFavorites);
        const found = favoritesArray.some((item) => item.id === perfume.id);
        setIsFavorite(found);
      }
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const saveToFavorites = async () => {
    try {
      const currentFavorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = currentFavorites ? JSON.parse(currentFavorites) : [];

      const alreadyFavorite = favoritesArray.some(
        (item) => item.id === perfume.id
      );

      if (!alreadyFavorite) {
        favoritesArray.push(perfume);
        await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
        setIsFavorite(true);
        Alert.alert("Success", "Added to favorites");
      } else {
        Alert.alert("Info", "This perfume is already in your favorites");
      }
    } catch (error) {
      console.error("Error saving to favorites:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerAction}>
        <TouchableOpacity onPress={goBack}>
          <Icon
            type="antdesign"
            name="arrowleft"
            color="#000"
            style={styles.btnBack}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={saveToFavorites}>
          <Icon
            type="antdesign"
            name="heart"
            color={isFavorite ? "red" : "white"}
            style={styles.btnBack}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Image source={{ uri: perfume.image }} style={styles.image} />
        <View style={styles.perfumeDetail}>
          <Text style={styles.name}>{perfume.perfumeName}</Text>
          <View style={styles.textPrice}>
            <Text style={{ fontSize: 16, color: "#BC5B27" }}>Price</Text>
            <Text style={styles.price}>${perfume.price}</Text>
          </View>
        </View>
        <Text style={styles.description}>{perfume.perfumeDescription}</Text>

        <Text style={{ fontSize: 24, fontWeight: "500", marginLeft: 12 }}>
          Feedback
        </Text>
        <View style={styles.feedbackContainer}>
          {perfume.feedbacks.map((feedback, index) => (
            <View key={index} style={styles.feedbackItem}>
              <View style={styles.ratingHeader}>
                <Icon type="feather" name="user" size={24} />
                <View style={styles.userInfo}>
                  <Text style={styles.feedbackAuthor}>{feedback.author}</Text>
                  <Rating
                    startingValue={feedback.rating}
                    imageSize={20}
                    readonly
                    style={{ marginTop: 8 }}
                  />
                </View>
              </View>
              <Text>{feedback.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    width: "70%",
  },
  textPrice: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  price: {
    justifyContent: "center",
    fontSize: 24,
    marginBottom: 8,
    fontWeight: "800",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    paddingLeft: 12,
    paddingRight: 12,
    fontStyle: "italic",
    fontWeight: "500",
  },
  feedbackContainer: {
    marginTop: 16,
    marginLeft: 20,
  },
  feedbackItem: {
    marginBottom: 12,
  },
  feedbackAuthor: {
    fontWeight: "bold",
  },
  headerAction: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 10,
    paddingRight: 12,
    paddingLeft: 12,
    backgroundColor: "#fff", // Ensure the background color matches your main container background
  },
  btnBack: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  perfumeDetail: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  ratingHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
});

export default DetailScreen;
