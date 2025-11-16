import { createFileRoute } from "@tanstack/react-router";
import { FlowerForm } from "@/components/FlowerForm";
import { type FlowerRecord } from "@/lib/flowerStorage";
import { useFlowers } from "@/lib/flowerContext";

export const Route = createFileRoute("/flowers/$id/edit")({
    component: Edit,
    staticData: {
        showMenu: false,
        showHeader: true,
        customHeader: "Edytuj",
    },
});

function Edit() {
    const flowerCtx = useFlowers();
    const navigate = Route.useNavigate();
    const flowerId = Number(Route.useParams().id);

    const flower = flowerCtx.actions.getById(flowerId);

    if (!flower) {
        return <div>Kwiat nie znaleziony</div>;
    }

    async function editAction(flower: FlowerRecord) {
        await flowerCtx.actions.updateFlower(flower);
        navigate({ to: "/flowers", params: { id: flower.id.toString() } });
    }

    return (
        <FlowerForm
            defaultValue={flower}
            action={editAction}
            sumbitButtonLabel="Zapisz"
            secondaryButtonLabel="Anuluj"
        />
    );
}
