import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

interface Props {
  config: object;
}

export default function ParticleBackground({ config }: Props) {
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  if (!engineReady) return null;

  return (
    <Particles
      id="tsparticles"
      options={config as ISourceOptions}
      className="particle-bg"
    />
  );
}
