import { createFileRoute } from "@tanstack/react-router";
import { FlowerForm } from "@/components/FlowerForm";
import { type FlowerRecord } from "@/lib/flowerStorage";
import { useFlowers } from "@/lib/flowerContext";

export const Route = createFileRoute("/flowers/add")({
    component: Add,
    staticData: {
        customHeader: "Nowy kwiatek",
        showHeader: true,
    },
});

function Add() {
    const navigate = Route.useNavigate();
    const flowerCtx = useFlowers();
    async function addAction(flower: FlowerRecord) {
        flowerCtx.actions.addFlower(flower);
        navigate({ to: "/flowers" });
    }

    return <FlowerForm action={addAction} sumbitButtonLabel="Dodaj" secondaryButtonLabel="Anuluj" />;
}
