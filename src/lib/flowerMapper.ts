import type { FlowerView } from "@/types/FlowerView";
import type { FlowerRecord } from "@/lib/flowerStorage";

export function toFlowerView(record: FlowerRecord): FlowerView {
    if (!record.image) {
        return {
            ...record,
            kind: "view",
        };
    }
    const imageUrl = URL.createObjectURL(record.image);

    return {
        ...record,
        kind: "view",
        imageUrl,
    };
}
