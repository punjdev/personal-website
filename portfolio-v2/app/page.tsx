import dynamic from "next/dynamic";

const PhysicsScene = dynamic(() => import("../components/PhysicsScene"), { ssr: false });

export default function Home() {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <PhysicsScene />
        </div>
    );
}
