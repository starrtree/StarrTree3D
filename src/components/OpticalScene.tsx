import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Mesh, MeshPhysicalMaterial } from "three";
import { fruitAssets, type FruitWorldId } from "../data/assets";
function OpticalModel({
  id,
  color,
  onReady,
}: {
  id: FruitWorldId;
  color: string;
  onReady: () => void;
}) {
  const { scene } = useGLTF(fruitAssets[id].model);
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((node) => {
      if (node instanceof Mesh) {
        const core = /energy|nucleus|connection|aperture|inner/i.test(
          node.name,
        );
        node.material = new MeshPhysicalMaterial({
          color: core ? color : "#dcecff",
          roughness: core ? 0.25 : 0.09,
          metalness: 0.1,
          transmission: core ? 0 : 0.84,
          thickness: 0.4,
          ior: 1.46,
          iridescence: core ? 0 : 1,
          iridescenceIOR: 1.32,
          iridescenceThicknessRange: [180, 600],
          clearcoat: 1,
          emissive: color,
          emissiveIntensity: core ? 0.7 : 0.025,
        });
      }
    });
    return copy;
  }, [scene, color]);
  useEffect(() => {
    onReady();
    return () => {
      model.traverse((node) => {
        if (node instanceof Mesh) {
          const m = node.material;
          if (!Array.isArray(m)) m.dispose();
        }
      });
    };
  }, [model, onReady]);
  return <primitive object={model} />;
}

export default function OpticalScene({
  id,
  color,
  markReady,
  setFailed,
}: {
  id: FruitWorldId;
  color: string;
  markReady: () => void;
  setFailed: (value: boolean) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="demand"
      camera={{ position: [0.35, 2.25, 6.5], fov: 36 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={null}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          () => setFailed(true),
          { once: true },
        );
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={3} />
      <pointLight position={[-2, 1, 3]} color={color} intensity={7} />
      <Suspense fallback={null}>
        <OpticalModel id={id} color={color} onReady={markReady} />
        <Environment resolution={128}>
          <Lightformer position={[-3, 3, 4]} scale={[3, 5, 1]} intensity={3} />
          <Lightformer
            position={[3, 1, -2]}
            scale={[2, 4, 1]}
            color={color}
            intensity={5}
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
