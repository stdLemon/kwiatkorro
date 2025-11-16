import { type FlowerRecord } from "@/lib/flowerStorage";
export type FlowerView = Omit<FlowerRecord, "image" | "kind"> & {
    kind: "view";
    imageUrl?: string;
};
