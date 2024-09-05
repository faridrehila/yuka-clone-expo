import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DATA } from "@/constants/Data";
import NutrimentItem from "@/components/NutrimentItem";

const Modal = () => {
  // recuperer le product dans le storage
  const { code } = useLocalSearchParams() as { code: string };
  console.log("code", code);

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await AsyncStorage.getItem("products");
        const savedProducts = products ? JSON.parse(products) : [];
        console.log("savedProducts", savedProducts);
        const product = savedProducts.find((p: any) => p.code === code);
        console.log("product", product);
        setProduct(product);
      } catch (error) {
        console.error(error);
      }
    };

    loadProduct();
  }, []);

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  console.log("product infos => ", product.nutriments);

  const BAD_NUTRIMENTS = Object.keys(product.nutriments).filter(
    (key: string) => {
      if (Object.keys(DATA).includes(key)) {
        return product.nutriments[key] > DATA[key].limit;
      }
      return false;
    }
  );

  const GOOD_NUTRIMENTS = Object.keys(product.nutriments).filter(
    (key: string) => {
      if (Object.keys(DATA).includes(key)) {
        return product.nutriments[key] < DATA[key].limit;
      }
      return false;
    }
  );

  return (
    <ScrollView>
      <View style={styles.header}>
        <Image source={{ uri: product.image_url }} style={styles.image} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.product_name}</Text>
          <Text style={styles.productBrand}>{product.brands}</Text>

          <Text
            style={[
              styles.score,
              { color: product.score >= 50 ? "green" : "red" },
            ]}
          >
            {product.score} /100
          </Text>
        </View>
      </View>

      <View style={styles.containerNutriment}>
        <Text style={styles.title}>Bien</Text>
        {GOOD_NUTRIMENTS.map((key: string) => (
          <NutrimentItem
            good
            key={key}
            {...DATA[key]}
            subtitle="Excellente quantité"
            value={product.nutriments[key]}
          />
        ))}

        <Text style={styles.title}>Moins bien</Text>
        {BAD_NUTRIMENTS.map((key: string) => (
          <NutrimentItem
            good={false}
            key={key}
            {...DATA[key]}
            subtitle="Mauvaise quantité"
            value={product.nutriments[key]}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    gap: 20,
    alignItems: "flex-start",
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productInfo: {
    flexDirection: "column",
    gap: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productBrand: {
    fontSize: 14,
    color: "gray",
  },
  score: {
    fontWeight: "bold",
    fontSize: 16,
  },
  containerNutriment: {
    flexDirection: "column",
    gap: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Modal;
