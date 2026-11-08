import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HoloPlanet: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per guidelines
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030816, 0.0018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 22.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.margin = '0 auto';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1a3a, 1.5);
    scene.add(ambientLight);

    const keyCyanLight = new THREE.PointLight(0x00f0ff, 3.5, 50);
    keyCyanLight.position.set(0, 8, 10);
    scene.add(keyCyanLight);

    const bottomSpotLight = new THREE.PointLight(0x00d2ff, 4, 30);
    bottomSpotLight.position.set(0, -4, 2);
    scene.add(bottomSpotLight);

    const rimMagentaLight = new THREE.PointLight(0xe024c3, 2.5, 40);
    rimMagentaLight.position.set(-8, 3, -6);
    scene.add(rimMagentaLight);

    // Planet Group (Centered)
    const planetGroup = new THREE.Group();
    planetGroup.position.set(0, 0.6, 0);
    scene.add(planetGroup);

    // Procedural Earth / Cyber Map Canvas Texture
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = 1024;
    mapCanvas.height = 512;
    const ctx = mapCanvas.getContext('2d')!;

    // Dark cyber ocean background
    ctx.fillStyle = '#06142e';
    ctx.fillRect(0, 0, 1024, 512);

    // Draw latitude and longitude cyber grid
    ctx.strokeStyle = 'rgba(0, 220, 255, 0.28)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Procedural glowing continent shapes (stylized cyber earth clusters)
    ctx.fillStyle = '#00f3ff';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 8;

    function drawCyberContinent(cx: number, cy: number, w: number, h: number) {
      for (let i = 0; i < 45; i++) {
        const px = cx + (Math.sin(i * 1.7) * w * 0.45) + (Math.cos(i * 3.1) * 20);
        const py = cy + (Math.cos(i * 2.3) * h * 0.45) + (Math.sin(i * 1.9) * 15);
        const radius = 6 + (Math.sin(i * 4.3) * 4);
        ctx.beginPath();
        ctx.arc(px, py, Math.max(3, radius), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Americas
    drawCyberContinent(280, 180, 130, 160);
    drawCyberContinent(340, 340, 120, 170);
    // Europe & Africa
    drawCyberContinent(540, 160, 110, 120);
    drawCyberContinent(560, 310, 130, 160);
    // Asia & Australia
    drawCyberContinent(740, 180, 190, 160);
    drawCyberContinent(830, 370, 90, 80);

    const earthTexture = new THREE.CanvasTexture(mapCanvas);
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    // 1. Inner glowing sphere with cyber map texture
    const sphereRadius = 4.3;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.2,
      metalness: 0.15,
      color: 0x00f0ff,
      emissive: new THREE.Color(0x003366),
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.85,
    });
    const planetMesh = new THREE.Mesh(sphereGeo, sphereMat);
    planetGroup.add(planetMesh);

    // 1b. Inner high-intensity electric blue core
    const coreGeo = new THREE.SphereGeometry(sphereRadius * 0.94, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x0044aa,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    planetGroup.add(coreMesh);

    // 2. Outer Holographic Wireframe Atmosphere Shell
    const wireGeo = new THREE.SphereGeometry(sphereRadius * 1.04, 32, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    planetGroup.add(wireMesh);

    // 3. Glowing Atmosphere Corona Aura
    const glowGeo = new THREE.SphereGeometry(sphereRadius * 1.15, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00a2ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    planetGroup.add(glowMesh);

    // 4. Multiple Orbital Rings with Traveling Data Pods
    const ringsGroup = new THREE.Group();
    planetGroup.add(ringsGroup);

    // Ring 1: Glowing Cyan Tilted Track
    const ring1Geo = new THREE.TorusGeometry(6.6, 0.08, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.38;
    ring1.rotation.y = Math.PI * 0.12;
    ringsGroup.add(ring1);

    // Ring 2: Radiant Magenta / Purple Wide Track
    const ring2Geo = new THREE.TorusGeometry(7.6, 0.12, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xd916c6,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI * 0.32;
    ring2.rotation.z = Math.PI * 0.18;
    ringsGroup.add(ring2);

    // Ring 3: Segmented neon track
    const ring3Geo = new THREE.TorusGeometry(5.6, 0.04, 12, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI * 0.48;
    ring3.rotation.y = -Math.PI * 0.15;
    ringsGroup.add(ring3);

    // Satellite / Data Pod Traveling on Ring 1
    const pod1Geo = new THREE.BoxGeometry(0.7, 0.35, 0.4);
    const pod1Mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f7ff,
      emissiveIntensity: 1.2,
      roughness: 0.2,
    });
    const pod1 = new THREE.Mesh(pod1Geo, pod1Mat);
    ring1.add(pod1);

    // Satellite / Data Capsule Traveling on Ring 2
    const pod2Geo = new THREE.CapsuleGeometry(0.3, 0.8, 6, 12);
    const pod2Mat = new THREE.MeshStandardMaterial({
      color: 0xff46e8,
      emissive: 0xff00b3,
      emissiveIntensity: 1.5,
      roughness: 0.1,
    });
    const pod2 = new THREE.Mesh(pod2Geo, pod2Mat);
    ring2.add(pod2);

    // 5. Cosmic Particle Field
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x00ffff);
    const c2 = new THREE.Color(0xd916c6);
    const c3 = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 5.5 + Math.random() * 7.5;

      particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = r * Math.cos(phi);

      const chosenColor = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    planetGroup.add(particlePoints);

    // 6. Base Projector Platform / Stepped Holographic Dais (Concentric mechanical dais with glowing rings)
    const platformGroup = new THREE.Group();
    platformGroup.position.set(0, -4.8, 0);
    scene.add(platformGroup);

    // Base Tier 1 (outer dark metallic disc)
    const tier1Geo = new THREE.CylinderGeometry(7.2, 7.8, 0.45, 48);
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x091428,
      metalness: 0.85,
      roughness: 0.35,
    });
    const tier1 = new THREE.Mesh(tier1Geo, darkMetalMat);
    platformGroup.add(tier1);

    // Tier 1 Glowing Red/Pink Segment Ring
    const redGlowRingGeo = new THREE.TorusGeometry(6.5, 0.09, 16, 64);
    const redGlowRingMat = new THREE.MeshBasicMaterial({
      color: 0xff0055,
      transparent: true,
      opacity: 0.9,
    });
    const redGlowRing = new THREE.Mesh(redGlowRingGeo, redGlowRingMat);
    redGlowRing.rotation.x = Math.PI / 2;
    redGlowRing.position.y = 0.26;
    platformGroup.add(redGlowRing);

    // Tier 2 (inner metallic tier)
    const tier2Geo = new THREE.CylinderGeometry(5.2, 5.6, 0.5, 48);
    const tier2 = new THREE.Mesh(tier2Geo, darkMetalMat);
    tier2.position.y = 0.4;
    platformGroup.add(tier2);

    // Tier 2 Glowing Cyan Ring
    const cyanRingGeo = new THREE.TorusGeometry(4.7, 0.1, 16, 64);
    const cyanRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f7ff,
      transparent: true,
      opacity: 1,
    });
    const cyanRing = new THREE.Mesh(cyanRingGeo, cyanRingMat);
    cyanRing.rotation.x = Math.PI / 2;
    cyanRing.position.y = 0.7;
    platformGroup.add(cyanRing);

    // Tier 3 Core Projector Lens
    const tier3Geo = new THREE.CylinderGeometry(3.6, 4.0, 0.35, 48);
    const tier3 = new THREE.Mesh(tier3Geo, darkMetalMat);
    tier3.position.y = 0.8;
    platformGroup.add(tier3);

    // Projector Emitter Light Disc
    const emitterGeo = new THREE.CircleGeometry(3.0, 32);
    const emitterMat = new THREE.MeshBasicMaterial({
      color: 0x00f7ff,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const emitter = new THREE.Mesh(emitterGeo, emitterMat);
    emitter.rotation.x = Math.PI / 2;
    emitter.position.y = 1.0;
    platformGroup.add(emitter);

    // Upward Holographic Light Projection Cone
    const coneGeo = new THREE.ConeGeometry(5.2, 7.5, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00e1ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lightCone = new THREE.Mesh(coneGeo, coneMat);
    lightCone.position.y = 4.0;
    platformGroup.add(lightCone);

    // High-precision timer avoiding deprecated THREE.Clock
    let animId = 0;
    const startTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          animId = window.setTimeout(cb, 80);
        }
      };
      animId = window.setTimeout(poll, 5);
    }

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Rotate planet
      planetMesh.rotation.y = elapsedTime * 0.15;
      wireMesh.rotation.y = elapsedTime * 0.18;
      wireMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.08;

      // Rotate rings independently
      ring1.rotation.z = elapsedTime * 0.25;
      ring2.rotation.z = -elapsedTime * 0.2;
      ring3.rotation.z = elapsedTime * 0.12;

      // Position pods along their circular rings
      const t1 = elapsedTime * 0.8;
      pod1.position.x = Math.cos(t1) * 6.6;
      pod1.position.y = Math.sin(t1) * 6.6;
      pod1.rotation.z = t1 + Math.PI / 2;

      const t2 = -elapsedTime * 0.65;
      pod2.position.x = Math.cos(t2) * 7.6;
      pod2.position.y = Math.sin(t2) * 7.6;
      pod2.rotation.z = t2 + Math.PI / 2;

      // Slowly rotate particle field
      particlePoints.rotation.y = elapsedTime * 0.05;
      particlePoints.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;

      // Platform pulse
      redGlowRingMat.opacity = 0.7 + Math.sin(elapsedTime * 3) * 0.25;
      cyanRingMat.opacity = 0.8 + Math.cos(elapsedTime * 2.5) * 0.2;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        animId = requestAnimationFrame(animate);
      }
    };

    if (isSoftwareGl) {
      afterDraw(animate);
    } else {
      animId = requestAnimationFrame(animate);
    }

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) {
        clearTimeout(animId);
      } else {
        cancelAnimationFrame(animId);
      }
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      pod1Geo.dispose();
      pod1Mat.dispose();
      pod2Geo.dispose();
      pod2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      earthTexture.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[480px] md:h-[540px] flex flex-col items-center justify-center text-center mx-auto pointer-events-none select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full flex items-center justify-center" />

      {/* Center Holographic DevOS Floating Title (as in reference image) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center translate-y-0 pointer-events-none">
        <h1 
          className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-cyan-300 drop-shadow-[0_0_25px_rgba(0,240,255,0.9)] text-center"
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            textShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 160, 255, 0.5)',
          }}
        >
          DevOS
        </h1>
        <div className="flex items-center justify-center gap-2 mt-1 px-3 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-md text-center">
          <span className="text-xs font-semibold tracking-widest text-cyan-200 text-center">
            Build <span className="text-cyan-400">•</span> Learn <span className="text-cyan-400">•</span> Grow
          </span>
        </div>
      </div>
    </div>
  );
};
