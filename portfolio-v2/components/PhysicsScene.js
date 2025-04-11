"use client";

import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { Html } from "@react-three/drei";

function DraggableElement({ text, position }) {
    const ref = useRef();
    const [active, setActive] = useState(false);

    const bind = useDrag(({ offset: [x, y] }) => {
        ref.current.setTranslation({ x: x / 50, y: -y / 50, z: 0 });
    });

    return (
        <RigidBody ref={ref} type="dynamic" colliders="ball">
            <Html position={position} {...bind()} style={{ cursor: "grab" }}>
                <button onClick={() => setActive(!active)} className="bg-blue-500 text-white px-4 py-2">
                    {text}
                </button>
            </Html>
        </RigidBody>
    );
}

export default function PhysicsScene() {
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            <Physics gravity={[0, -9.81, 0]}>
                <DraggableElement text="Click Me!" position={[0, 1, 0]} />
                <DraggableElement text="Another Button" position={[1, 2, 0]} />
            </Physics>
        </Canvas>
    );
}
