import UsersLayout from "@/Layouts/UsersLayout";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function Dashboard({ auth }) {
    const mountRef = useRef(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [userPin, setUserPin] = useState(null);
    const [controls, setControls] = useState(null);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(30, 30, 30);
        camera.lookAt(0, 0, 0);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        mountRef.current.appendChild(renderer.domElement);

        // Raycaster setup
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Function to create text sprite
        const createTextSprite = (text) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 128;

            context.font = '24px Arial';
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.fillText(text, 128, 64);

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(10, 5, 1);

            return sprite;
        };

        // Create user location pin
        const createUserPin = () => {
            const geometry = new THREE.CylinderGeometry(0, 2, 4, 4);
            const material = new THREE.MeshPhongMaterial({ color: 0xC30E59 });
            const pin = new THREE.Mesh(geometry, material);
            pin.position.set(177.5, 2, -10); // Set to specified coordinates (y=2 for height above ground)
            pin.rotation.x = Math.PI;
            
            // Add "You" label
            const label = createTextSprite("You");
            label.position.set(177.5, 5, -10); // Position above the pin
            scene.add(label);
            pin.userData.label = label; // Store label reference with pin
            
            scene.add(pin);
            setUserPin(pin);
            return pin;
        };

        // Create user pin
        const pin = createUserPin();

        // Store original colors for reset
        const originalColors = new Map();

        // Function to create a building with label
        const createBuilding = (width, height, depth, color, position, id, name) => {
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                flatShading: true,
            });
            const building = new THREE.Mesh(geometry, material);
            building.position.set(position.x, position.y + (height / 2), position.z);
            building.castShadow = true;
            building.receiveShadow = true;
            building.userData = { name, color, id }; // Store building data
            originalColors.set(building.uuid, color);

            const label = createTextSprite(name);
            label.position.set(position.x, position.y + height + 2, position.z);

            return { building, label };
        };

        // Create platform
        const platformGeometry = new THREE.BoxGeometry(430, 1, 110);
        const platformMaterial = new THREE.MeshPhongMaterial({
            color: 0x999999,
            flatShading: true,
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.5;
        platform.receiveShadow = true;
        scene.add(platform);

        // Create multiple buildings with labels
        const buildingsData = [
            { params: [30, 10, 40, 0x808080, { x: -5, y: 0, z: 0 }, "001", "Building A"] },
            { params: [10, 8, 15, 0x808080, { x: -25, y: 0, z: 0 }, "002", "Building B"] },
            { params: [20, 10, 35, 0x808080, { x: -105, y: 0, z: -10 }, "003", "Building C"] },
            { params: [10, 8, 20, 0x808080, { x: -93, y: 0, z: -10 }, "004", "Building D"] },
            { params: [10, 8, 10, 0x808080, { x: 15, y: 0, z: 45 }, "002", "Building E"] },
            { params: [10, 8, 10, 0x808080, { x: -5, y: 0, z: 45 }, "002", "Building F"] },
            { params: [10, 8, 10, 0x808080, { x: -20, y: 0, z: 45 }, "002", "Building G"] },
            { params: [10, 10, 10, 0x808080, { x: -47, y: 0, z: 45 }, "002", "Building H"] },
            { params: [15, 8, 10, 0x808080, { x: -65, y: 0, z: 45 }, "002", "Building I"] },
            { params: [15, 8, 10, 0x808080, { x: -85, y: 0, z: 45 }, "002", "Building J"] },
            { params: [8, 5, 8, 0x808080, { x: -100, y: 0, z: 44 }, "002", "Building K"] },
            { params: [15, 8, 10, 0x808080, { x: -115, y: 0, z: 45 }, "002", "Building L"] },
            { params: [8, 8, 10, 0x808080, { x: -140, y: 0, z: 45 }, "002", "Building M"] },
            { params: [20, 8, 10, 0x808080, { x: -160, y: 0, z: 45 }, "002", "Building N"] },
            { params: [30, 8, 12, 0x808080, { x: 60, y: 0, z: 46 }, "002", "Building O"] },
            { params: [30, 8, 12, 0x808080, { x: 120, y: 0, z: 46 }, "002", "Building P"] },
            { params: [15, 8, 30, 0x808080, { x: 160, y: 0, z: -10 }, "002", "Building Q"] },
            //{ params: [3, 30,3, 0x808080, { x: 15, y: 0, z: 35 },"002", "Pin"] },
            { params: [30, 8, 15, 0x808080, { x: 170, y: 0, z: -48 }, "002", "Building R"] },
            { params: [15, 8, 10, 0x808080, { x: -30, y: 0, z: -45 }, "001", "Building S"] },
            { params: [8, 8, 10, 0x808080, { x: -48, y: 0, z: -45 }, "001", "Building T"] },
            { params: [8, 8, 10, 0x808080, { x: -60, y: 0, z: -45 }, "001", "Building U"] },
            { params: [8, 8, 10, 0x808080, { x: -73, y: 0, z: -45 }, "001", "Building V"] },
            { params: [8, 8, 10, 0x808080, { x: -83, y: 0, z: -45 }, "001", "Building W"] },
            { params: [8, 8, 10, 0x808080, { x: -135, y: 0, z: -45 }, "001", "Building X"] },
            { params: [8, 8, 10, 0x808080, { x: -170, y: 0, z: -45 }, "001", "Building X"] },
            { params: [10, 10, 20, 0x808080, { x: -165, y: 0, z: 0 }, "003", "Building Y"] },
            { params: [8, 8, 8, 0x808080, { x: -165, y: 0, z: 27 }, "003", "Building Z"] },

        ];

        const buildings = [];
        const labels = [];

        buildingsData.forEach(({ params }) => {
            const { building, label } = createBuilding(...params);
            buildings.push(building);
            labels.push(label);
            scene.add(building);
            scene.add(label);
        });

        // Click handler
        const handleClick = (event) => {
            event.preventDefault();

            // Calculate mouse position in normalized device coordinates
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(buildings);

            // Reset all buildings to original color
            buildings.forEach(building => {
                building.material.color.setHex(originalColors.get(building.uuid));
            });

            if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                console.log('Building Data:', selectedObject.userData);
                selectedObject.material.color.setHex(0x638C6D); // Highlight in red
                setSelectedBuilding(selectedObject);
            } else {
                setSelectedBuilding(null);
            }
        };

        // Add click event listener
        renderer.domElement.addEventListener('click', handleClick);

        // Function to create a path between two points
        const createPath = (startPoint, endPoint, pathName) => {
            const showLabel = false;

            const direction = new THREE.Vector3(
                endPoint.x - startPoint.x,
                0,
                endPoint.z - startPoint.z
            );
            const length = direction.length();
            direction.normalize();

            // Create a rotated geometry for the path
            const pathWidth = 5; // Adjust this value to control path thickness
            const pathGeometry = new THREE.BoxGeometry(length, 0.1, pathWidth);
            const pathMaterial = new THREE.MeshPhongMaterial({
                color: 0x4C585B,
                flatShading: true
            });
            const path = new THREE.Mesh(pathGeometry, pathMaterial);

            // Position the path
            path.position.set(
                startPoint.x + direction.x * length / 2,
                0.1,
                startPoint.z + direction.z * length / 2
            );

            // Calculate the rotation angle
            const angle = Math.atan2(direction.z, direction.x);
            path.rotation.y = -angle;

            // Create path label if showLabel is true
            if (showLabel && pathName) {
                const label = createTextSprite(pathName);
                // Position the label above the middle of the path
                label.position.set(
                    startPoint.x + direction.x * length / 2,
                    2, // Height above the path
                    startPoint.z + direction.z * length / 2
                );
                path.userData = { label }; // Store label reference
                scene.add(label);
            }

            return path;
        };

        // Create paths
        const paths = [
            createPath({ x: -180, z: -35 }, { x: 180, z: -35 }, "Path 1"),
            createPath({ x: -180, z: 35 }, { x: 180, z: 35 }, "Path 2"),
            createPath({ x: 177.5, z: 35 }, { x: 177.5, z: -35 }, "Path 3"),
            createPath({ x: 15, z: 35 }, { x: 15, z: -35 }, "Path 4"),
            createPath({ x: -40, z: 35 }, { x: -40, z: -35 }, "Path 5"),
            createPath({ x: -125, z: 35 }, { x: -125, z: -35 }, "Path 6"),
            createPath({ x: -80, z: 25 }, { x: -80, z: -25 }, "Path 7"),
            createPath({ x: -40, z: -22.5 }, { x: -80, z: -22.5 }, "Path 8"),
            createPath({ x: -40, z: 22.5 }, { x: -80, z: 22.5 }, "Path 9"),
            createPath({ x: -177.5, z: 35 }, { x: -177.5, z: -35 }, "Path 10"),
        ];

        paths.forEach(path => scene.add(path));

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(20, 20, 20);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        scene.add(directionalLight);

        // Add controls with reference
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.05;
        setControls(orbitControls);

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);

            // Animate user pin
            if (pin) {
                // Floating animation
                pin.position.y = 5 + Math.sin(Date.now() * 0.003) * 0.5; // Gentle floating effect
                // Update label position to follow pin
                if (pin.userData.label) {
                    pin.userData.label.position.y = pin.position.y + 3;
                }
            }

            // Animate target pin
            if (targetPin) {
                // Floating animation with slight phase difference
                targetPin.position.y = 5 + Math.sin(Date.now() * 0.003 + Math.PI) * 0.5;
                // Update label position to follow pin
                if (targetPin.userData.label) {
                    targetPin.userData.label.position.y = targetPin.position.y + 3;
                }
            }

            orbitControls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);
            buildings.forEach(building => scene.remove(building));
            paths.forEach(path => {
                scene.remove(path);
                if (path.userData && path.userData.label) {
                    scene.remove(path.userData.label);
                }
            });
            scene.remove(platform);
            scene.remove(pin);
            scene.remove(targetPin);
            if (pin.userData.label) {
                scene.remove(pin.userData.label);
            }
            if (targetPin.userData.label) {
                scene.remove(targetPin.userData.label);
            }
            renderer.dispose();
        };
    }, []);

    // Add function to focus camera on user pin
    const focusOnUserPin = () => {
        if (userPin && controls) {
            const pinPosition = userPin.position;
            // Move camera to a position above and slightly offset from the pin
            const cameraOffset = new THREE.Vector3(20, 20, 20);
            const newCameraPosition = new THREE.Vector3(
                pinPosition.x + cameraOffset.x,
                pinPosition.y + cameraOffset.y,
                pinPosition.z + cameraOffset.z
            );

            // Set camera position and update controls target
            controls.object.position.copy(newCameraPosition);
            controls.target.set(pinPosition.x, pinPosition.y, pinPosition.z);
            controls.update();
        }
    };

    return (
        <UsersLayout title="Map" user={auth.user}>
            <div ref={mountRef} style={{ width: '100%', height: '100vh' }}></div>
            <button
                onClick={focusOnUserPin}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#C30E59',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Focus on My Location
            </button>
        </UsersLayout>
    );
}
