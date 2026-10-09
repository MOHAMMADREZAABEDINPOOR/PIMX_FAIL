import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';

// A real-time, exploded architectural model. Geometry is generated locally.
export default function FailureScene({ reducedMotion }: { reducedMotion: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (!host.current) return;
    const element = host.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      setAvailable(false);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
    camera.position.set(8.5, 6.2, 10);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xdce8cb, 1.2));
    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(4, 8, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb7ff48, 3);
    rim.position.set(-4, 3, -4);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x8996ae, 2);
    fill.position.set(-5, 1, 5);
    scene.add(fill);

    const sculpture = new THREE.Group();
    sculpture.rotation.y = -0.25;
    scene.add(sculpture);
    const charcoal = new THREE.MeshStandardMaterial({ color: 0x323831, metalness: 0.65, roughness: 0.29 });
    const silver = new THREE.MeshStandardMaterial({ color: 0x8d9587, metalness: 0.75, roughness: 0.28 });
    const lime = new THREE.MeshStandardMaterial({ color: 0xc1ff5c, emissive: 0xa0f12a, emissiveIntensity: 0.45, metalness: 0.25, roughness: 0.28 });
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xb5c49c, transparent: true, opacity: 0.4 });
    const slabs: { object: THREE.Group; y: number; phase: number }[] = [];
    for (let level = 0; level < 7; level++) {
      const group = new THREE.Group();
      const width = 3.25 - level * 0.11;
      const depth = 2.8 - level * 0.08;
      const geometry = new THREE.BoxGeometry(width, 0.42, depth);
      const block = new THREE.Mesh(geometry, level === 3 || level === 6 ? lime : level % 2 ? charcoal : silver);
      group.add(block);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
      group.add(edges);
      // Repeating vertical columns give the object an architectural silhouette.
      if (level < 6) {
        for (const x of [-1, 1]) for (const z of [-1, 1]) {
          const column = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.45, 0.085), charcoal);
          column.position.set(x * width * 0.39, 0.43, z * depth * 0.38);
          group.add(column);
        }
      }
      group.position.set(level > 3 ? (level - 3) * 0.2 : 0, -2.5 + level * 0.83, level > 3 ? -(level - 3) * 0.14 : 0);
      group.rotation.y = level > 2 ? (level - 2) * 0.14 : -0.03 * level;
      sculpture.add(group);
      slabs.push({ object: group, y: group.position.y, phase: level * 0.7 });
    }

    const foundation = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.15, 3.65), charcoal);
    foundation.position.y = -3.02;
    sculpture.add(foundation);
    const grid = new THREE.GridHelper(16, 24, 0x64734f, 0x30372b);
    grid.position.y = -3.15;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.24;
    scene.add(grid);

    const orbit = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.012, 6, 120), lime);
    orbit.rotation.set(Math.PI / 2.5, 0.25, 0.2);
    orbit.position.y = -0.2;
    scene.add(orbit);
    const points = new Float32Array(48 * 3);
    // Deterministic dust avoids varying geometry across re-mounts.
    for (let i = 0; i < 48; i++) {
      points[i * 3] = Math.sin(i * 12.4) * 5;
      points[i * 3 + 1] = Math.cos(i * 4.2) * 3.4;
      points[i * 3 + 2] = Math.sin(i * 7.5) * 4;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xc4fb79, size: 0.025, transparent: true, opacity: 0.65 }));
    scene.add(dust);

    const pointer = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const resetPointer = () => { pointer.x = 0; pointer.y = 0; };
    element.addEventListener('pointermove', onPointer);
    element.addEventListener('pointerleave', resetPointer);
    const resize = new ResizeObserver(() => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    });
    resize.observe(element);
    let inView = true;
    const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
    visibility.observe(element);
    let frame = 0;
    let activeTime = 0;
    let previous = 0;
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (!inView || document.hidden) return;
      if (!reducedMotion) {
        activeTime += delta;
        sculpture.rotation.y += (pointer.x * 0.28 - 0.25 + Math.sin(activeTime * 0.18) * 0.12 - sculpture.rotation.y) * 0.04;
        sculpture.rotation.x += (pointer.y * 0.1 - sculpture.rotation.x) * 0.04;
        slabs.forEach(({ object, y, phase }) => { object.position.y = y + Math.sin(activeTime * 0.8 + phase) * 0.045; });
        dust.rotation.y = activeTime * 0.018;
        orbit.rotation.z = 0.2 + Math.sin(activeTime * 0.25) * 0.12;
      }
      renderer.render(scene, camera);
    };
    if (reducedMotion) renderer.render(scene, camera);
    else frame = requestAnimationFrame(render);
    const onContextLost = (event: Event) => { event.preventDefault(); setAvailable(false); cancelAnimationFrame(frame); };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      element.removeEventListener('pointermove', onPointer);
      element.removeEventListener('pointerleave', resetPointer);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      scene.traverse(object => {
        const drawable = object as THREE.Mesh;
        drawable.geometry?.dispose();
        if (drawable.material) {
          const materials = Array.isArray(drawable.material) ? drawable.material : [drawable.material];
          materials.forEach(material => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return <div className="scene-shell" aria-label="Exploded three-dimensional architectural sculpture">
    <div ref={host} className="scene-canvas" aria-hidden="true" />
    {!available && <div className="scene-fallback" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} style={{ '--level': i } as CSSProperties} />)}</div>}
    <div className="scene-coordinate coordinate-top"><span className="status-dot" /> STRUCTURE / 001</div>
    <div className="scene-coordinate coordinate-side">DECONSTRUCT. UNDERSTAND. REBUILD.</div>
    <div className="scene-bottom"><span><i /> THE ANATOMY OF A FAILURE</span><span>{reducedMotion ? 'STILL VIEW' : 'MOVE TO EXPLORE'} <span aria-hidden="true">↗</span></span></div>
    <div className="scene-cross cross-one" aria-hidden="true">+</div><div className="scene-cross cross-two" aria-hidden="true">+</div>
  </div>;
}
