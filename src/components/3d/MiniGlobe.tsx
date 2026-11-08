import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const MiniGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 90;
    const height = container.clientHeight || 90;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Mini wireframe globe
    const sphereGeo = new THREE.SphereGeometry(1.3, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const globe = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(globe);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x004488,
      transparent: true,
      opacity: 0.35,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    // Mini orbital ring
    const ringGeo = new THREE.TorusGeometry(1.7, 0.04, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f7ff,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.35;
    scene.add(ring);

    let animId: number;
    const animate = () => {
      globe.rotation.y += 0.015;
      ring.rotation.z += 0.01;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-20 h-20 pointer-events-none" />;
};
