import {
  Image,
  StyleSheet,
  Platform,
  FlatList,
  SafeAreaView,
  View,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCallback, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);

  const loadProducts = async () => {
    try {
      const allProducts = await AsyncStorage.getItem("products");
      const savedProducts = allProducts ? JSON.parse(allProducts) : [];
      setProducts(savedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Link href={`/modal?code=${item.code}`}>
        <ThemedView style={styles.itemContainer}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <View>
            <ThemedText style={styles.title}>{item.product_name}</ThemedText>
            <ThemedText style={styles.subtitle}>{item.brands}</ThemedText>
            <ThemedText
              style={[
                styles.score,
                { color: item.score >= 50 ? "green" : "red" },
              ]}
            >
              {item.score}
            </ThemedText>
          </View>

          <Ionicons name="chevron-forward" size={20} color="gray" />
        </ThemedView>
      </Link>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    backgroundColor: "transparent",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    padding: 10,
  },
  image: {
    height: 80,
    width: 80,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
  },
  score: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
