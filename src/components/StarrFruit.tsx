import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  lazy,
  useState,
  type ReactNode,
} from "react";
const OpticalScene = lazy(() => import("./OpticalScene"));

import { fruitAssets, type FruitWorldId } from "../data/assets";
import { useExperience } from "./Experience";

type Props = {
  worldId: string;
  color: string;
  large?: boolean;
  staticOnly?: boolean;
};
class VisualBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
/** Decorative sculpture only. Navigation, words, purchase controls stay in HTML. */
export default function StarrFruit({
  worldId,
  color,
  large = false,
  staticOnly = false,
}: Props) {
  const id = (worldId in fruitAssets ? worldId : "music") as FruitWorldId;
  const [reduced, setReduced] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const { motion } = useExperience();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const markReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    setReady(false);
    setEnabled(true);
    setFailed(false);
  }, [id]);
  const show3D = large && enabled && motion && !staticOnly && !reduced && !failed;
  return (
    <div
      className={`starrfruit ${large ? "starrfruit-large" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: large ? 260 : 100,
        isolation: "isolate",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "10%",
          background: `radial-gradient(ellipse,${color}24,transparent 65%)`,
          filter: "blur(12px)",
        }}
      />
      <img
        src={fruitAssets[id].poster}
        alt=""
        aria-hidden="true"
        width="640"
        height="640"
        loading={large ? "eager" : "lazy"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          position: "relative",
          opacity: show3D && ready ? 0 : 1,
          filter: `drop-shadow(0 0 20px ${color}22)`,
        }}
      />
      {show3D && (
        <div aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
          <VisualBoundary onFailure={() => setFailed(true)}>
            <Suspense fallback={null}>
              <OpticalScene
                id={id}
                color={color}
                markReady={markReady}
                setFailed={setFailed}
              />
            </Suspense>
          </VisualBoundary>
        </div>
      )}
      {large && !staticOnly && !reduced && !failed && (
        <button
          className="fruit-view-toggle"
          onClick={() => setEnabled((v) => !v)}
          style={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            fontSize: 11,
            padding: "7px 12px",
            border: "1px solid #ffffff30",
            borderRadius: 20,
            background: "#080d1de0",
            color: "#e5e9ff",
            whiteSpace: "nowrap",
          }}
          aria-pressed={enabled}
        >
          {enabled ? "Use still image" : "View optical 3D"}
        </button>
      )}
    </div>
  );
}
