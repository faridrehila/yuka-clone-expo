import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  subtitle: string;
  icon: any;
  good: boolean;
  value: number;
};

const NutrimentItem = ({ title, subtitle, icon, good, value }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Ionicons name={icon} size={20} />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.subcontainer}>
        <Text style={styles.title}>{value}</Text>
        <View
          style={[styles.dot, { backgroundColor: good ? "green" : "red" }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  subcontainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default NutrimentItem;
