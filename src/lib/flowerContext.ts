import React from "react";
import { flowerStorage } from "./flowerStorage";

import type { FlowerRecord, FlowerRecordPatch } from "./flowerStorage";
import type { FlowerView } from "@/types/FlowerView";
import { toFlowerView } from "./flowerMapper";

export type Action =
    | {
          type: "initialize";
          flowers: FlowerRecord[];
      }
    | {
          type: "create";
          flower: FlowerRecord;
      }
    | {
          type: "read";
      }
    | {
          type: "update";
          flower: FlowerRecord;
      }
    | {
          type: "delete";
          id: number;
      };

type State = {
    flowers: FlowerView[];
};

function flowerReducer(state: State, action: Action): State {
    switch (action.type) {
        case "initialize":
            return { flowers: action.flowers.map((elem) => toFlowerView(elem)) };
        case "create":
            return { flowers: [...state.flowers, toFlowerView(action.flower)] };
        case "read":
            return state;
        case "update":
            return {
                flowers: state.flowers.map((flower) =>
                    flower.id === action.flower.id ? toFlowerView(action.flower) : flower,
                ),
            };
        case "delete":
            return {
                flowers: state.flowers.filter((flower) => flower.id !== action.id),
            };
        default:
            return state;
    }
}

export function useFlowersReducer() {
    const [flowers, disptach] = React.useReducer(flowerReducer, { flowers: [] });

    React.useEffect(() => {
        flowerStorage.getAll().then((flowers) => {
            disptach({ type: "initialize", flowers: flowers });
        });
    }, []);

    function addFlower(flower: FlowerRecord) {
        flowerStorage.add(flower).then((flowerId) => {
            disptach({ type: "create", flower: { ...flower, id: flowerId } });
        });
    }

    function removeFlower(flowerId: number) {
        flowerStorage.remove(flowerId).then(() => {
            const flower = getById(flowerId);
            disptach({ type: "delete", id: flowerId });
            if (flower?.imageUrl) {
                URL.revokeObjectURL(flower.imageUrl);
            }
        });
    }

    function getById(flowerId: number) {
        return flowers.flowers.find((flower) => flower.id === flowerId);
    }

    async function updateFlower(flowerPatch: FlowerRecordPatch) {
        const curr = await flowerStorage.get(flowerPatch.id);
        if (!curr) {
            return;
        }
        const merged = { ...curr, ...flowerPatch };

        if (flowerPatch.image) {
            const oldFlower = getById(flowerPatch.id);
            if (oldFlower?.imageUrl) {
                URL.revokeObjectURL(oldFlower.imageUrl);
            }
        }
        await flowerStorage.update(merged);
        disptach({ type: "update", flower: merged });
    }

    return {
        state: flowers,
        actions: {
            addFlower,
            removeFlower,
            getById,
            updateFlower,
        },
    };
}

export const FlowerContext = React.createContext<ReturnType<typeof useFlowersReducer> | null>(null);

export function useFlowers() {
    const context = React.useContext(FlowerContext);
    if (!context) {
        throw new Error("useFlowers must be used within a FlowerProvider");
    }
    return context;
}
