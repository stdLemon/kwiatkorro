import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MdAddAPhoto } from "react-icons/md";
import { useNavigate } from "@tanstack/react-router";
import type { FlowerRecord } from "@/lib/flowerStorage";
import type { FlowerView } from "@/types/FlowerView";

const sections = [
    [
        {
            label: "Nazwa",
            name: "name",
            type: "text",
        },
        {
            label: "Gatunek",
            name: "species",
            type: "text",
        },
        {
            label: "Data zakupu",
            name: "boughtDate",
            type: "date",
            defaultValue: new Date().toISOString().split("T")[0],
        },
    ],
    [
        {
            label: "Wielkość doniczki",
            name: "potSizeCm",
            type: "number",
        },
        {
            label: "Notatki",
            name: "notes",
            type: "text",
        },
    ],
];

type FlowerAvatarProps = {
    defaultImageUrl?: string;
    readonly: boolean;
};

function FlowerAvatar({ defaultImageUrl, readonly }: FlowerAvatarProps) {
    const [preview, setPreview] = React.useState<string | undefined>(defaultImageUrl);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const fileUrl = URL.createObjectURL(file);
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setPreview(fileUrl);
    }

    React.useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    function handleImageOnClick() {
        if (readonly) {
            return;
        }
        fileInputRef.current?.click();
    }

    return (
        <>
            {preview ? (
                <img
                    src={preview}
                    onClick={handleImageOnClick}
                    className="h-full max-h-[60vh] min-h-0 w-full object-contain"
                />
            ) : (
                <div
                    onClick={handleImageOnClick}
                    className="flex h-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400"
                >
                    <MdAddAPhoto className="h-12 w-12 text-gray-400" />
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />
        </>
    );
}

type FlowerFormProps = {
    defaultValue?: FlowerView;
    action: (flower: FlowerRecord) => Promise<void>;
    sumbitButtonLabel: string;
    secondaryButtonLabel: string;
    readonly?: boolean;
};

export function FlowerForm(props: FlowerFormProps) {
    const navigate = useNavigate();

    async function handleAction(data: FormData) {
        type FlowerFormData = {
            [K in keyof Omit<FlowerRecord, "kind">]: FormDataEntryValue | null;
        };

        const flowerData: FlowerFormData = {
            id: data.get("id"),
            boughtDate: data.get("boughtDate"),
            name: data.get("name"),
            potSizeCm: data.get("potSizeCm"),
            species: data.get("species"),
            archivedDate: data.get("archivedDate"),
            image: data.get("image"),
            notes: data.get("notes"),
        };

        const flower: FlowerRecord = {
            kind: "record",
            id: Number(flowerData.id),
            name: String(flowerData.name),
            boughtDate: String(flowerData.boughtDate),
            potSizeCm: Number(flowerData.potSizeCm),
            species: String(flowerData.species),
            notes: String(flowerData.notes),
        };

        const img = flowerData.image as File;
        if (img && img.size > 0) {
            flower.image = img;
        }

        await props.action(flower);
    }

    function getDefaultValue(fieldName: keyof FlowerView) {
        return props.defaultValue ? props.defaultValue[fieldName] : undefined;
    }

    return (
        <form action={handleAction} className="flex h-full w-full flex-col justify-around gap-2">
            <FlowerAvatar defaultImageUrl={props.defaultValue?.imageUrl} readonly={props.readonly || false} />
            <input type="hidden" name="id" value={getDefaultValue("id")} />
            {sections.map((section) => {
                return (
                    <section className="grid grid-cols-2 gap-5 rounded-sm border p-4">
                        {section.map((input) => (
                            <React.Fragment key={input.name}>
                                <Label htmlFor={input.name}>{input.label}:</Label>
                                <Input
                                    defaultValue={
                                        getDefaultValue(input.name as keyof FlowerView) || input.defaultValue || ""
                                    }
                                    name={input.name}
                                    type={input.type}
                                    className="border"
                                    disabled={props.readonly}
                                />
                            </React.Fragment>
                        ))}
                    </section>
                );
            })}
            <section className="flex justify-around">
                <Button
                    onClick={() => {
                        navigate({ to: "/flowers" });
                    }}
                    type="button"
                    variant="secondary"
                >
                    {props.secondaryButtonLabel}
                </Button>
                <Button type="submit">{props.sumbitButtonLabel}</Button>
            </section>
        </form>
    );
}
