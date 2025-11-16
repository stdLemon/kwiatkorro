import { FlowerContext, useFlowersReducer } from "@/lib/flowerContext";
import { createRootRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

const routes = [
    { name: "Lista", path: "/flowers" },
    { name: "Dodaj", path: "/flowers/add" },
];

function Menu() {
    const { matches } = useRouterState();
    const title = matches[matches.length - 1].staticData?.menuEntryName;

    return (
        <nav className="">
            <ul className="flex justify-around">
                {routes.map((item) => (
                    <li key={item.name}>
                        <Link
                            to={item.path}
                            className="block cursor-pointer rounded-t-xl px-4"
                            activeOptions={{ exact: true }}
                            activeProps={{ className: "bg-green-400" }}
                            inactiveProps={{ className: "bg-green-200" }}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
            {title && (
                <div className="bg-green-400 text-center">
                    <label>{title}</label>
                </div>
            )}
        </nav>
    );
}

function Header() {
    const { matches } = useRouterState();
    const staticData = matches[matches.length - 1].staticData;

    const defaultHeader = "Kwiatkorro";
    const headerText = staticData.customHeader || defaultHeader;

    if (staticData.showHeader) {
        return (
            <header className="border-b">
                <h1 className="py-2 text-center text-3xl">{headerText}</h1>
            </header>
        );
    }

    return <header></header>;
}

function RootLayout() {
    const { matches } = useRouterState();
    const staticData = matches[matches.length - 1].staticData;

    const flowersHook = useFlowersReducer();
    return (
        <div className="grid h-[100dvh] grid-cols-[1fr] grid-rows-[auto_1fr_auto] gap-2">
            <FlowerContext value={flowersHook}>
                <Header />
                <main className="container mx-auto flex h-full flex-col overflow-y-hidden px-4">
                    <Outlet />
                </main>
                <footer>{staticData.showMenu && <Menu />}</footer>
            </FlowerContext>
        </div>
    );
}

export const Route = createRootRoute({ component: RootLayout });
