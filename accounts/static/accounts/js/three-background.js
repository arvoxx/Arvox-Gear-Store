import * as THREE from 'three';

(() => {
    'use strict';

    const canvas = document.getElementById('gear-scene');
    const host = document.querySelector('.hardware-stage');
    if (!canvas || !host) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower = window.matchMedia('(max-width: 1100px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
    let renderer;

    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: !lowPower,
            powerPreference: 'low-power',
            stencil: false,
            depth: true
        });
    } catch (error) {
        canvas.hidden = true;
        console.info('ArvoxGear: WebGL is unavailable; the CSS stage remains active.', error);
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    camera.position.set(0, 0.12, 8.9);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.15 : 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    scene.add(new THREE.AmbientLight(0xb6dfff, 1.45));
    const cyanLight = new THREE.PointLight(0x36dcf5, 46, 16, 2);
    cyanLight.position.set(3.3, 2.3, 4);
    scene.add(cyanLight);
    const purpleLight = new THREE.PointLight(0x9270ef, 30, 14, 2);
    purpleLight.position.set(-3.8, -1.5, 2.2);
    scene.add(purpleLight);
    const topLight = new THREE.DirectionalLight(0xe3f6ff, 1.35);
    topLight.position.set(0.5, 4, 5);
    scene.add(topLight);

    const gpu = new THREE.Group();
    gpu.rotation.set(-0.15, -0.23, -0.035);
    gpu.position.set(0.06, -0.08, 0);
    scene.add(gpu);

    const bodyMaterial = new THREE.MeshPhysicalMaterial({ color: 0x182535, metalness: 0.88, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.25 });
    const faceMaterial = new THREE.MeshStandardMaterial({ color: 0x0c1725, metalness: 0.78, roughness: 0.38 });
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x31485e, metalness: 0.9, roughness: 0.25 });
    const cyanMaterial = new THREE.MeshStandardMaterial({ color: 0x5ce8f5, metalness: 0.74, roughness: 0.22, emissive: 0x0c5264, emissiveIntensity: 0.9 });
    const purpleMaterial = new THREE.MeshStandardMaterial({ color: 0x9c80ef, metalness: 0.72, roughness: 0.28, emissive: 0x30205c, emissiveIntensity: 0.75 });
    const fanMaterial = new THREE.MeshStandardMaterial({ color: 0x29394a, metalness: 0.83, roughness: 0.31 });
    const darkFanMaterial = new THREE.MeshStandardMaterial({ color: 0x111d2b, metalness: 0.72, roughness: 0.42 });

    function addBox(parent, geometry, material, position, rotation = [0, 0, 0]) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.rotation.set(...rotation);
        parent.add(mesh);
        return mesh;
    }

    // Main graphite housing, with a slightly exposed cooler edge for a believable GPU silhouette.
    addBox(gpu, new THREE.BoxGeometry(6.15, 1.72, 0.7), bodyMaterial, [0, 0, 0]);
    addBox(gpu, new THREE.BoxGeometry(6.02, 1.56, 0.14), faceMaterial, [0, 0, 0.39]);
    addBox(gpu, new THREE.BoxGeometry(6.23, 0.085, 0.73), edgeMaterial, [0, 0.88, 0.02]);
    addBox(gpu, new THREE.BoxGeometry(6.23, 0.07, 0.73), edgeMaterial, [0, -0.88, 0.02]);

    // Three restrained fan assemblies on the front plate.
    const fanGroups = [];
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0.08, 0.08);
    bladeShape.bezierCurveTo(0.2, 0.18, 0.39, 0.35, 0.47, 0.26);
    bladeShape.bezierCurveTo(0.43, 0.08, 0.28, -0.02, 0.1, -0.06);
    bladeShape.lineTo(0.08, 0.08);
    const bladeGeometry = new THREE.ShapeGeometry(bladeShape, 10);

    [-1.78, 0, 1.78].forEach((x, fanIndex) => {
        const fan = new THREE.Group();
        fan.position.set(x, 0, 0.49);
        gpu.add(fan);

        const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.63, 0.045, 10, 64), fanIndex === 1 ? purpleMaterial : cyanMaterial);
        fan.add(outerRing);
        const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.018, 8, 56), edgeMaterial);
        innerRing.position.z = 0.018;
        fan.add(innerRing);

        const rotor = new THREE.Group();
        rotor.position.z = 0.025;
        fan.add(rotor);
        for (let blade = 0; blade < 7; blade += 1) {
            const material = blade % 2 ? fanMaterial : darkFanMaterial;
            const bladeMesh = new THREE.Mesh(bladeGeometry, material);
            bladeMesh.rotation.z = (blade / 7) * Math.PI * 2;
            bladeMesh.position.z = 0.025;
            rotor.add(bladeMesh);
        }

        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.09, 32), edgeMaterial);
        hub.rotation.x = Math.PI / 2;
        hub.position.z = 0.065;
        fan.add(hub);
        const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.1, 32), fanIndex === 1 ? purpleMaterial : cyanMaterial);
        hubCap.rotation.x = Math.PI / 2;
        hubCap.position.z = 0.12;
        fan.add(hubCap);

        const screwGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.025, 12);
        [[-0.49, -0.49], [-0.49, 0.49], [0.49, -0.49], [0.49, 0.49]].forEach(([sx, sy]) => {
            const screw = new THREE.Mesh(screwGeometry, edgeMaterial);
            screw.rotation.x = Math.PI / 2;
            screw.position.set(sx, sy, 0.04);
            fan.add(screw);
        });
        fanGroups.push(rotor);
    });

    // Accent rails, end cap, PCIe contacts and small ventilation details.
    addBox(gpu, new THREE.BoxGeometry(0.055, 1.25, 0.035), cyanMaterial, [-3.0, 0, 0.49]);
    addBox(gpu, new THREE.BoxGeometry(0.055, 1.25, 0.035), purpleMaterial, [3.0, 0, 0.49]);
    addBox(gpu, new THREE.BoxGeometry(0.23, 1.45, 0.78), edgeMaterial, [3.18, 0, 0.02]);
    for (let pin = 0; pin < 8; pin += 1) {
        addBox(gpu, new THREE.BoxGeometry(0.12, 0.1, 0.035), cyanMaterial, [-2.7 + pin * 0.22, -0.93, 0.32]);
    }
    for (let vent = 0; vent < 12; vent += 1) {
        addBox(gpu, new THREE.BoxGeometry(0.06, 0.38, 0.025), darkFanMaterial, [-2.78 + vent * 0.18, 0.78, 0.47], [0, 0, -0.1]);
    }

    // A small number of distant points adds depth without filling the whole composition.
    const particleCount = lowPower ? 55 : 105;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
        const offset = index * 3;
        positions[offset] = (Math.random() - 0.5) * 11;
        positions[offset + 1] = (Math.random() - 0.5) * 5.5;
        positions[offset + 2] = -1.5 - Math.random() * 4;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x9deeff, size: 0.022, transparent: true, opacity: 0.42, depthWrite: false }));
    scene.add(particles);

    let frameId = null;
    let visible = true;
    let pageVisible = !document.hidden;
    let lastFrame = 0;
    const clock = new THREE.Clock();

    function resize() {
        const width = Math.max(1, host.clientWidth);
        const height = Math.max(1, host.clientHeight);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        renderer.render(scene, camera);
    }

    function draw(now = 0) {
        if (!visible || !pageVisible) {
            frameId = null;
            return;
        }
        if (now - lastFrame < 33) {
            frameId = requestAnimationFrame(draw);
            return;
        }
        lastFrame = now;
        const elapsed = clock.getElapsedTime();
        gpu.rotation.y = -0.23 + Math.sin(elapsed * 0.24) * 0.035;
        gpu.rotation.x = -0.15 + Math.sin(elapsed * 0.2) * 0.018;
        gpu.position.y = -0.08 + Math.sin(elapsed * 0.55) * 0.055;
        fanGroups.forEach((rotor, index) => {
            rotor.rotation.z = elapsed * (index === 1 ? -0.55 : 0.48);
        });
        particles.rotation.y = elapsed * 0.012;
        particles.rotation.x = Math.sin(elapsed * 0.12) * 0.018;
        cyanLight.position.x = 3.3 + Math.sin(elapsed * 0.38) * 0.45;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(draw);
    }

    function start() {
        if (reducedMotion) {
            renderer.render(scene, camera);
            return;
        }
        if (frameId === null && visible && pageVisible) {
            lastFrame = 0;
            clock.start();
            frameId = requestAnimationFrame(draw);
        }
    }
    function stop() {
        if (frameId !== null) cancelAnimationFrame(frameId);
        frameId = null;
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start(); else stop();
    }, { threshold: 0.01 });
    const resizeObserver = new ResizeObserver(resize);
    intersectionObserver.observe(host);
    resizeObserver.observe(host);
    document.addEventListener('visibilitychange', () => {
        pageVisible = !document.hidden;
        if (pageVisible) start(); else stop();
    });

    resize();
    host.classList.add('webgl-ready');
    start();

    window.addEventListener('pagehide', () => {
        stop();
        intersectionObserver.disconnect();
        resizeObserver.disconnect();
        scene.traverse((object) => {
            object.geometry?.dispose();
            if (object.material) {
                const materials = Array.isArray(object.material) ? object.material : [object.material];
                materials.forEach((material) => material.dispose());
            }
        });
        renderer.dispose();
    }, { once: true });
})();
