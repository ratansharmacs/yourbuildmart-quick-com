import ultratechImg from "@/assets/ultratech.png";
import accImg from "@/assets/acc.png";
import ambujaImg from "@/assets/ambuja.png";
import jksuperImg from "@/assets/jksuper.png";
import polycabImg from "@/assets/polycab.png";
import hingeImg from "@/assets/hinge.png";
import cementCategoryImg from "@/assets/image 28773 (3).png";
import tilingCategoryImg from "@/assets/image 28774 (1).png";
import plywoodCategoryImg from "@/assets/image 28775.png";
import fevicolCategoryImg from "@/assets/image 28776.png";
import waterproofingCategoryImg from "@/assets/image 28777.png";
import paintingCategoryImg from "@/assets/image 28778 (1).png";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "cement" | "wires" | "hardware";
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  sale: string;
  image: string;
};

export const cementProducts: Product[] = [
  { id: "ultratech-50kg", name: "UltraTech Super Cement - 50kg", brand: "UltraTech", category: "cement", price: 14.99, oldPrice: 20.99, rating: 4.0, reviews: 128, sale: "Sale 50%", image: ultratechImg },
  { id: "acc-gold-50kg", name: "ACC Gold Water Cement - 50kg", brand: "ACC", category: "cement", price: 14.99, oldPrice: 20.99, rating: 4.0, reviews: 128, sale: "Sale 50%", image: accImg },
  { id: "ambuja-roof-50kg", name: "Ambuja Plus Roof Special - 50kg", brand: "Ambuja", category: "cement", price: 14.99, oldPrice: 20.99, rating: 4.0, reviews: 128, sale: "Sale 50%", image: ambujaImg },
  { id: "jk-super-50kg", name: "JK Super Cement Premium - 50kg", brand: "JK Super", category: "cement", price: 14.99, oldPrice: 20.99, rating: 4.0, reviews: 128, sale: "Sale 50%", image: jksuperImg },
];

export const wireProducts: Product[] = Array.from({ length: 4 }).map((_, i) => ({
  id: i === 0 ? "polycab-frls-h" : `polycab-frls-h-${i}`,
  name: "Polycab FRLS-H Single Core Wire",
  brand: "Polycab",
  category: "wires",
  price: 799,
  oldPrice: 1047,
  rating: 4.0,
  reviews: 128,
  sale: "20% Off",
  image: polycabImg,
}));

export const hardwareProducts: Product[] = Array.from({ length: 4 }).map((_, i) => ({
  id: `hinge-${i}`,
  name: "Ebco Euro Slow Motion Soft Close",
  brand: "Ebco",
  category: "hardware",
  price: 799,
  oldPrice: 1047,
  rating: 4.0,
  reviews: 128,
  sale: "20% Off",
  image: hingeImg,
}));

export const categories = [
  { name: "Cement", icon: cementCategoryImg },
  { name: "Tiling", icon: tilingCategoryImg },
  { name: "Plywood", icon: plywoodCategoryImg },
  { name: "Fevicol", icon: fevicolCategoryImg },
  { name: "Waterproofing", icon: waterproofingCategoryImg },
  { name: "Painting", icon: paintingCategoryImg },
];
