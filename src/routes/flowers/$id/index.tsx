import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { useFlowers } from "@/lib/flowerContext";
import { FlowerForm } from "@/components/FlowerForm";
import type { FlowerRecord } from "@/lib/flowerStorage";

export const Route = createFileRoute("/flowers/$id/")({
    component: Flower,
    staticData: {
        showMenu: false,
        showHeader: true,
        customHeader: "Szczegóły",
    },
});

function Flower() {
    const flowerCtx = useFlowers();
    const router = useRouter();
    const flowerId = Number(Route.useParams().id);

    const flower = flowerCtx.actions.getById(flowerId);

    if (!flower) {
        return <div>Flower not found</div>;
    }

    async function handleEdit(flower: FlowerRecord) {
        router.navigate({ to: "/flowers/$id/edit", params: { id: String(flower.id) } });
    }

    return (
        <FlowerForm
            defaultValue={flower}
            action={handleEdit}
            sumbitButtonLabel="Edytuj"
            secondaryButtonLabel="Wstecz"
            readonly={true}
        />
    );
}
