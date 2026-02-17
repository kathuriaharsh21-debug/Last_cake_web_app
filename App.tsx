import React, { useState, useRef } from "react";
import {
  Plus,
  Sparkles,
  Image as ImageIcon,
  Layout,
  Flower2,
  Square,
  Coffee,
  Palette,
  Sun,
  Wand2,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";
import { ProductImage, BrandingConfig, Preset, BrandLogo } from "./types";
import { LaParisLogo } from "./components/Logo";
import { ProcessingCard } from "./components/ProcessingCard";

const PRESETS: Preset[] = [
  { id: "avenue-montaigne", label: "Avenue Montaigne", description: "Classic Marble & Gold", icon: "Layout" },
  { id: "jardin-palais", label: "Jardin du Palais", description: "Dreamy Garden Floral", icon: "Flower2" },
  { id: "solid-chic", label: "Solid Chic", description: "Premium Texture Catalog", icon: "Square" },
  { id: "artisanal-atelier", label: "Artisanal Atelier", description: "Warm Limestone Craft", icon: "Coffee" },
  { id: "champagne-soiree", label: "Champagne Soirée", description: "Festive Silk & Bokeh", icon: "Palette" },
  { id: "saint-germain", label: "Saint-Germain Chic", description: "Modern Minimal Pastel", icon: "Sun" },
  { id: "ai-magic", label: "AI Magic", description: "Creative Exploration", icon: "Wand2" },
];

const LUXE_COLORS = [
  { name: "Ivory Cream", value: "#FAF9F6" },
  { name: "Rose Quartz", value: "#FDF0F0" },
  { name: "Sage Leaf", value: "#E9F0E9" },
  { name: "Noir Slate", value: "#2A2A2A" },
  { name: "French Navy", value: "#1A2A3A" },
  { name: "Sandstone", value: "#E5D3B3" },
];

const App: React.FC = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [branding, setBranding] = useState<BrandingConfig>({
    logoVisible: false,
    logoPosition: "bottom-right",
    logoOpacity: 0.85,
    upscale: true,
    activePreset: "avenue-montaigne",
    selectedLogoId: "default",
    selectedColor: "Ivory Cream",
  });

  const [logos, setLogos] = useState<BrandLogo[]>([
    {
      id: "default",
      name: "La Paris Gold",
      url: "https://images.unsplash.com/photo-1549488344-cbb6c34ce08b?q=80&w=200&h=200&auto=format&fit=crop",
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ProductImage[] = Array.from(files).map((file: File) => ({
      id: Math.random().toString(36).substring(7),
      originalUrl: URL.createObjectURL(file),
      status: "pending",
      name: file.name.split(".")[0],
      progress: 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.readAsDataURL(blob);
    });
  };

  const processImage = async (imageId: string) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, status: "processing", progress: 10 } : img
      )
    );

    try {
      let logoBase64: string | undefined = undefined;

      if (branding.logoVisible && branding.selectedLogoId) {
        const selectedLogo = logos.find((l) => l.id === branding.selectedLogoId);
        if (selectedLogo) {
          logoBase64 = await getBase64(selectedLogo.url);
        }
      }

      const response = await fetch(image.originalUrl);
      const blob = await response.blob();
      const file = new File([blob], image.name, { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("preset", branding.activePreset);
      if (logoBase64) formData.append("logoBase64", logoBase64);
      if (branding.selectedColor) formData.append("selectedColor", branding.selectedColor);

      const res = await fetch("https://la-paris-editor.onrender.com/enhance", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Backend processing failed");
      }

      const data = await res.json();
      const resultUrl: string = data.imageUrl;

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, status: "completed", processedUrl: resultUrl, progress: 100 }
            : img
        )
      );
    } catch (error: any) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, status: "failed", error: error?.message || "Processing failed" }
            : img
        )
      );
    }
  };

  const processAll = () => {
    images.forEach((img) => {
      if (img.status === "pending" || img.status === "failed") {
        processImage(img.id);
      }
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `LaParis_Studio_${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPresetIcon = (id: string) => {
    const props = { size: 18 };
    switch (id) {
      case "avenue-montaigne":
        return <Layout {...props} />;
      case "jardin-palais":
        return <Flower2 {...props} />;
      case "solid-chic":
        return <Square {...props} />;
      case "artisanal-atelier":
        return <Coffee {...props} />;
      case "champagne-soiree":
        return <Palette {...props} />;
      case "saint-germain":
        return <Sun {...props} />;
      case "ai-magic":
        return <Wand2 {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  // UI JSX CONTINUES EXACTLY AS YOU HAD IT...
  // (No logic changes below this point)

  return (
    <div className="flex h-screen bg-[#FAF9F6] overflow-hidden w-full">
      {/* Your existing JSX stays unchanged */}
      {/* ... */}
    </div>
  );
};

export default App;
