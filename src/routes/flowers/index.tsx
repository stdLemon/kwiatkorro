import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useFlowers } from "@/lib/flowerContext";
import { CiCircleRemove } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import type { FlowerView } from "@/types/FlowerView";

export const Route = createFileRoute("/flowers/")({
    component: FlowerList,
    staticData: {
        menuEntryName: "Moje kwiatki",
        showHeader: true,
        showMenu: true,
    },
});

type FlowerEntryProps = {
    flower: FlowerView;
    onRemove: (flower: FlowerView) => void;
};

function FlowerEntry({ flower, onRemove }: FlowerEntryProps) {
    return (
        <li key={flower.id}>
            <div className="grid grid-cols-[1fr_max-content]">
                <Link to="/flowers/$id" params={{ id: String(flower.id) }}>
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={flower.imageUrl} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{flower.name}</p>
                            <p className="text-sm font-light">{flower.species}</p>
                        </div>
                    </div>
                </Link>
                <Button onClick={() => onRemove(flower)} variant="ghost">
                    <CiCircleRemove />
                </Button>
            </div>
        </li>
    );
}

function filterFlowers(flowers: FlowerView[], showArchived: boolean, term: string) {
    return flowers.filter((flower) => {
        const nameMatch =
            flower.name.toLowerCase().includes(term.toLowerCase()) ||
            flower.species.toLowerCase().includes(term.toLowerCase());
        const isArchived = flower.archivedDate !== undefined;
        return nameMatch && isArchived === showArchived;
    });
}

function FlowerList() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [showArchived, setShowArchived] = React.useState(false);
    const flowerCtx = useFlowers();

    function handleOnArchive(flower: FlowerView) {
        if (flower.archivedDate === undefined) {
            const archived = {
                archivedDate: new Date().toISOString().split("T")[0],
                id: flower.id,
            };

            flowerCtx.actions.updateFlower(archived);
            return;
        }

        flowerCtx.actions.removeFlower(flower.id);
    }

    return (
        <div className="flex flex-col gap-2 overflow-y-hidden">
            <div className="flex items-center gap-4">
                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Switch checked={showArchived} onCheckedChange={setShowArchived} aria-label="pokaż archiwum" />
            </div>
            <ul className="space-y-4 overflow-y-auto">
                {filterFlowers(flowerCtx.state.flowers, showArchived, searchTerm).map((flower) => (
                    <FlowerEntry key={flower.id} flower={flower} onRemove={handleOnArchive} />
                ))}
            </ul>
        </div>
    );
}
