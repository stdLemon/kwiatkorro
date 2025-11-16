import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";

export type FlowerRecord = {
    kind: "record";
    id: number;
    name: string;
    species: string;
    boughtDate: string;
    potSizeCm: number;
    image?: Blob;
    notes?: string;
    archivedDate?: string;
};

export type FlowerRecordPatch = { id: number } & Partial<Omit<FlowerRecord, "id" | "kind">>;

interface FlowerDB extends DBSchema {
    flowers: {
        key: number;
        value: Omit<FlowerRecord, "id">;
    };
}

let dbPromise: Promise<IDBPDatabase<FlowerDB>> | null = null;

async function getDB() {
    if (!dbPromise) {
        dbPromise = openDB<FlowerDB>("flower-db", 1, {
            upgrade(db) {
                db.createObjectStore("flowers", { keyPath: "id", autoIncrement: true });
            },
        });
    }
    return dbPromise;
}

async function getAll(): Promise<FlowerRecord[]> {
    const db = await getDB();
    return db.getAll("flowers") as Promise<FlowerRecord[]>;
}

async function get(id: number): Promise<FlowerRecord | undefined> {
    const db = await getDB();
    const flower = await db.get("flowers", id);
    return flower as FlowerRecord | undefined;
}

async function add(flower: Omit<FlowerRecord, "id" | "archivedAt">) {
    const db = await getDB();
    const newFlower: Omit<FlowerRecord, "id"> = {
        ...flower,
    };
    return await db.add("flowers", newFlower);
}

async function remove(id: number) {
    const db = await getDB();
    await db.delete("flowers", id);
}

async function put(flower: FlowerRecord) {
    const db = await getDB();
    await db.put("flowers", flower);
}

export const flowerStorage = {
    getAll,
    get,
    add,
    remove,
    update: put,
};
