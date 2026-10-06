import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Vector3, Group, Mesh, MeshPhysicalMaterial } from "three";
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
  const { scene } = useGLTF(fruitAssets[id].model, `${import.meta.env.BASE_URL}draco/`);
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.22;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.14) * 0.04;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.055;
  });
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((node) => {
      if (node instanceof Mesh) {
        if (fruitAssets[id].preserveMaterials) {
          node.material = Array.isArray(node.material) ? node.material.map(m => m.clone()) : node.material.clone();
          return;
        }
        const core = /energy|nucleus|connection|aperture|inner/i.test(
          node.name,
        );
        node.material = new MeshPhysicalMaterial({
          color: core ? color : "#a6bed1",
          roughness: core ? 0.25 : 0.055,
          metalness: 0.02,
          transmission: core ? 0 : 0.96,
          thickness: 0.18,
          ior: 1.46,
          iridescence: core ? 0 : 1,
          iridescenceIOR: 1.32,
          iridescenceThicknessRange: [180, 600],
          clearcoat: 1,
          emissive: color,
          emissiveIntensity: core ? 0.45 : 0.012,
        });
      }
    });
    const box = new Box3().setFromObject(copy);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    copy.position.sub(center);
    const normalized = new Group();
    normalized.add(copy);
    normalized.scale.setScalar(2.7 / Math.max(size.x, size.y, size.z));
    return normalized;
  }, [scene, color, id]);
  useEffect(() => {
    onReady();
    return () => {
      model.traverse((node) => {
        if (node instanceof Mesh) {
          const m = node.material;
          if (Array.isArray(m)) m.forEach(material => material.dispose());
          else m.dispose();
        }
      });
    };
  }, [model, onReady]);
  return <group ref={group}><primitive object={model} /></group>;
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
      frameloop="always"
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
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <pointLight position={[-2, 1, 3]} color={color} intensity={3} />
      <Suspense fallback={null}>
        <OpticalModel id={id} color={color} onReady={markReady} />
        <Environment resolution={128}>
          <Lightformer position={[-3, 3, 4]} scale={[3, 5, 1]} intensity={1.4} />
          <Lightformer
            position={[3, 1, -2]}
            scale={[2, 4, 1]}
            color={color}
            intensity={2}
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

