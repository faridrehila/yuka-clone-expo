import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";

const API_URL = "https://world.openfoodfacts.org/api/v3/product/";

const MOCKED_BARCODE = {
  bounds: {
    origin: { x: 118.09605583548546, y: 312.4161730706692 },
    size: { height: 130.63058361411095, width: 174.65437151491642 },
  },
  cornerPoints: [
    { x: 122.27471021281093, y: 312.4161773092338 },
    { x: 118.09604036171834, y: 432.0771753905564 },
    { x: 288.617239120705, y: 443.046751228594 },
    { x: 292.75042545512196, y: 324.6880648683861 },
  ],
  data: "3245412343810",
  target: 275,
  type: "org.gs1.EAN-13",
};

export default function TabTwoScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const saveItemToStorage = async (product: any) => {
    try {
      // check if product already exist
      const products = await AsyncStorage.getItem("products");
      console.log("products", products);
      const savedProducts = products ? JSON.parse(products) : [];
      const index = savedProducts?.findIndex(
        (p: any) => p.code === product.code
      );

      if (index === -1) {
        savedProducts.unshift(product);
        await AsyncStorage.setItem("products", JSON.stringify(savedProducts));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getScore = (product: any) => {
    const score = Math.round(
      (product.nutriments.energy_100g +
        product.nutriments.fat_100g +
        product.nutriments.carbohydrates_100g +
        product.nutriments.sugars_100g +
        product.nutriments.fiber_100g +
        product.nutriments.proteins_100g +
        product.nutriments.salt_100g) /
        100
    );
    return score;
  };

  const handleScan = async (scanningResult: BarcodeScanningResult) => {
    console.log("Scanned", scanningResult);

    // 1 scanned
    setScanned(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          API_URL + scanningResult.data + ".json?lc=fr"
        );
        console.log("response", response.data);

        console.log("response.data.status", response.data.status);

        if (response.data.status === "success") {
          // 3 save async storage
          const product = response.data.product;
          // getScore
          const score = getScore(product);

          await saveItemToStorage({ ...product, score });

          // 4 navigate to modal
          router.push({
            pathname: "/modal",
            params: {
              code: product.code,
            },
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setScanned(false);
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {scanned && (
        <View style={styles.feedback}>
          <ActivityIndicator color={"white"} />
        </View>
      )}
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8"],
        }}
        onBarcodeScanned={handleScan}
      >
        <View style={styles.overlay}>
          <Button onPress={() => handleScan(MOCKED_BARCODE)} title="Scanner" />
          <View style={styles.scanArea} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  feedback: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 300,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
});
