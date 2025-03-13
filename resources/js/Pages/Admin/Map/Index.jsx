import UsersLayout from "@/Layouts/UsersLayout";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FaLocationCrosshairs } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";

export default function Dashboard({ auth }) {
    // Calculate distance between two points
    const calculateDistance = (point1, point2) => {
        return Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.z - point1.z, 2)
        );
    };

    // Check if points are on the same horizontal or vertical line
    const canDirectlyConnect = (point1, point2) => {
        return point1.x === point2.x || point1.z === point2.z;
    };

    const optimizePath = (path) => {
        if (!path || path.length < 3) return path;

        const optimizedPath = [path[0]];
        let currentIndex = 0;

        while (currentIndex < path.length - 1) {
            let furthestConnectable = currentIndex + 1;

            // Look ahead for the furthest point we can directly connect to
            for (let i = currentIndex + 2; i < path.length; i++) {
                if (canDirectlyConnect(path[currentIndex], path[i])) {
                    furthestConnectable = i;
                }
            }

            optimizedPath.push(path[furthestConnectable]);
            currentIndex = furthestConnectable;
        }

        console.log(optimizedPath)

        return optimizedPath;
    };

    const directionPoints = [];

    // Find nearest navigation point to a given position
    const findNearestPoint = (position) => {
        let nearestPoint = pointsData[0];
        let minDistance = calculateDistance(position, pointsData[0]);

        pointsData.forEach(point => {
            const distance = calculateDistance(position, point);
            if (distance < minDistance) {
                minDistance = distance;
                nearestPoint = point;
            }
        });

        return nearestPoint;
    };

    const findNextPoint = (position, path) => {
        // Find next point by calculating distances to all points
        let nextPoint = null;
        let minDistance = Infinity;

        pointsData.forEach(point => {
            // Skip if point is already in path
            if (path.some(p => p.x === point.x && p.z === point.z)) {
                return;
            }
            // Skip if it's the current point
            if (point.x === position.x && point.z === position.z) return;

            const distance = calculateDistance(position, point);
            if (distance < minDistance) {
                minDistance = distance;
                nextPoint = point;
            }
        });

        if (nextPoint) {
            return nextPoint;
        }

        return null;
    }

    // Simple path finding between two points using available navigation points
    const findPath = (start, end) => {
        if (!start || !end) return null;

        console.log('Start point:', start);
        console.log('End point:', end);

        const path = [];
        let currentPoint = start;

        path.push(currentPoint);

        let finding = true;
        let seconds = 0;
        let index = 0;
        while (finding) {
            if (seconds >= 5000) {
                finding = false;
            }

            let nextPoint = findNextPoint(path[index], path);

            if (nextPoint) {
                path.push(nextPoint);

                // Check if we've reached the end point
                if (nextPoint.x === end.x && nextPoint.z === end.z) {
                    finding = false;
                    break;
                }

                index++;
            }

            seconds++;
        }

        // Find the index of the end point in the path
        const endIndex = path.findIndex(point => point.x === end.x && point.z === end.z);

        // If end point was found, trim and optimize the path
        if (endIndex !== -1) {
            path.slice(0, endIndex + 1);
        }

        return path;
    };

    const mountRef = useRef(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [userPin, setUserPin] = useState(null);
    const [targetPin, setTargetPin] = useState(null);
    const [controls, setControls] = useState(null);
    const [directionArrows, setDirectionArrows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [senaryo,setSenaryo] = useState(null);



    // Create points data
    const pointsData = [
        { x: 15, z: 0, id: "P001", name: "Check Point (Building A)" },
        { x: -40, z: 0, id: "P002", name: "Check Point (Building B)" },
        { x: -125, z: -10, id: "P003", name: "Check Point (Building C)" },
        { x: -80, z: -10, id: "P004", name: "Check Point (Building D)" },
        { x: 15, z: 35, id: "P005", name: "Check Point (Building E)" },
        { x: -5, z: 35, id: "P006", name: "Check Point (Building F)" },
        { x: -20, z: 35, id: "P007", name: "Check Point (Building G)" },
        { x: -47, z: 35, id: "P008", name: "Check Point (Building H)" },
        { x: -65, z: 35, id: "P009", name: "Check Point (Building I)" },
        { x: -85, z: 35, id: "P010", name: "Check Point (Building J)" },
        { x: -100, z: 35, id: "P011", name: "Check Point (Building K)" },
        { x: -115, z: 35, id: "P012", name: "Check Point (Building L)" },
        { x: -140, z: 35, id: "P013", name: "Check Point (Building M)" },
        { x: -160, z: 35, id: "P014", name: "Check Point (Building N)" },
        { x: 60, z: 35, id: "P015", name: "Check Point (Building O)" },
        { x: 120, z: 35, id: "P016", name: "Check Point (Building P)" },
        { x: 177.5, z: -10, id: "P017", name: "Check Point (Building Q)" },
        { x: 170, z: -35, id: "P018", name: "Check Point (Building R)" },
        { x: -30, z: -35, id: "P019", name: "Check Point (Building S)" },
        { x: -48, z: -35, id: "P020", name: "Check Point (Building T)" },
        { x: -60, z: -35, id: "P021", name: "Check Point (Building U)" },
        { x: -73, z: -35, id: "P022", name: "Check Point (Building V)" },
        { x: -83, z: -35, id: "P023", name: "Check Point (Building W)" },
        { x: -135, z: -35, id: "P024", name: "Check Point (Building X)" },
        { x: -170, z: -35, id: "P024", name: "Check Point (Building Y)" },
        { x: -177.5, z: 0, id: "P025", name: "Check Point (Building Z)" },
        { x: -177.5, z: 27, id: "P026", name: "Check Point (Building A1)" },
        { x: -40, z: 35, id: "P002", name: "Corner Check Point A" },
        { x: -40, z: -35, id: "P002", name: "Corner Check Point B" },
        { x: -40, z: 23, id: "P002", name: "Corner Check Point C" },
        { x: -40, z: -23, id: "P002", name: "Corner Check Point D" },
        { x: -80, z: 23, id: "P004", name: "Corner Check Point E" },
        { x: -80, z: -23, id: "P004", name: "Corner Check Point F" },
        { x: -125, z: 35, id: "P003", name: "Corner Check Point G" },
        { x: -125, z: -35, id: "P003", name: "Corner Check Point H" },
        { x: -177.5, z: 35, id: "P025", name: "Corner Check Point I" },
        { x: -177.5, z: -35, id: "P025", name: "Corner Check Point J" },
        { x: 15, z: -35, id: "P001", name: "Corner Check Point K" },
        { x: 177.5, z: 35, id: "P017", name: "Corner Check Point L" },
        { x: 177.5, z: -35, id: "P017", name: "Corner Check Point M" },
        { x: 60, z: -35, id: "P015", name: "Corner Check Point N" },
        { x: 120, z: -35, id: "P016", name: "Corner Check Point Q" },
    ];

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
        { params: [8, 8, 10, 0x808080, { x: -170, y: 0, z: -45 }, "001", "Building Y"] },
        { params: [10, 10, 20, 0x808080, { x: -165, y: 0, z: 0 }, "003", "Building Z"] },
        { params: [8, 8, 8, 0x808080, { x: -165, y: 0, z: 27 }, "003", "Building A1"] },

    ];

    
    
    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        setSenaryo(scene)
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

            context.fillStyle = 'rgba(0, 0, 0, 0)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.font = '24px Arial';
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.fillText(text, 128, 64);

            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;

            const spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                sizeAttenuation: true
            });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(10, 5, 1);

            // Store references for cleanup
            sprite.userData = {
                ...sprite.userData,
                texture: texture,
                material: spriteMaterial
            };

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

        // Function to create target pin
        const createTargetPin = () => {
            const geometry = new THREE.CylinderGeometry(0, 2, 4, 4);
            const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
            const pin = new THREE.Mesh(geometry, material);
            pin.position.set(15, 2, 35); // Set to specified coordinates
            pin.rotation.x = Math.PI;

            // Add "Target Location" label
            const label = createTextSprite("Destination");
            label.position.set(15, 5, 35); // Position above the pin
            scene.add(label);
            pin.userData.label = label; // Store label reference with pin

            scene.add(pin);
            setTargetPin(pin);
            return pin;
        };

        // Create target pin
        const targetPinObj = createTargetPin();

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

        const buildings = [];
        const labels = [];

        buildingsData.forEach(({ params }) => {
            const { building, label } = createBuilding(...params);
            buildings.push(building);
            labels.push(label);
            scene.add(building);
            scene.add(label);
        });


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
            // Animate target location pin
            if (targetPinObj) {
                // Floating animation
                targetPinObj.position.y = 5 + Math.sin(Date.now() * 0.003) * 0.5; // Gentle floating effect
                // Update label position to follow pin
                if (targetPinObj.userData.label) {
                    targetPinObj.userData.label.position.y = targetPinObj.position.y + 3;
                }
            }

            orbitControls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Function to create a point with label
        const createPoint = (position, id, name) => {
            const geometry = new THREE.CircleGeometry(0.5, 32);
            const material = new THREE.MeshPhongMaterial({
                color: 0x00ff00,
                side: THREE.DoubleSide,
                flatShading: true
            });
            const point = new THREE.Mesh(geometry, material);
            point.rotation.x = -Math.PI / 2; // Rotate to lay flat
            point.position.set(position.x, 0.2, position.z); // Slightly above platform
            point.userData = { name, id, type: 'point' }; // Store point data
            originalColors.set(point.uuid, 0x00ff00);

            const label = createTextSprite(name);
            label.position.set(position.x, 3, position.z);

            return { point, label };
        };

        // Create points
        const points = [];
        const pointLabels = [];

        pointsData.forEach(data => {
            const { point, label } = createPoint(
                { x: data.x, z: data.z },
                data.id,
                data.name
            );
            points.push(point);
            pointLabels.push(label);
            scene.add(point);
            scene.add(label);
        });


        // Modify click handler to include points
        const handleClick = (event) => {
            event.preventDefault();

            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            // Check intersections with both buildings and points
            const buildingIntersects = raycaster.intersectObjects(buildings);
            const pointIntersects = raycaster.intersectObjects(points);

            // Log intersection point if any intersection occurs
            if (buildingIntersects.length > 0 || pointIntersects.length > 0) {
                const intersection = buildingIntersects.length > 0 ? buildingIntersects[0] : pointIntersects[0];
                console.log('Intersection Point:', {
                    x: intersection.point.x,
                    y: intersection.point.y,
                    z: intersection.point.z
                });
            }

            // Reset all objects to original color
            buildings.forEach(building => {
                building.material.color.setHex(originalColors.get(building.uuid));
            });
            points.forEach(point => {
                point.material.color.setHex(originalColors.get(point.uuid));
            });

            if (pointIntersects.length > 0) {
                const selectedPoint = pointIntersects[0].object;
                console.log('Point Data:', selectedPoint.userData);
                selectedPoint.material.color.setHex(0xff0000); // Highlight in red
                setSelectedBuilding(null);
            } else if (buildingIntersects.length > 0) {
                const selectedObject = buildingIntersects[0].object;
                console.log('Building Data:', selectedObject.userData);
                selectedObject.material.color.setHex(0x638C6D);
                setSelectedBuilding(selectedObject);
            } else {
                setSelectedBuilding(null);
            }
        };

        renderer.domElement.addEventListener('click', handleClick);


        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Update cleanup to include points
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);

            // Cleanup buildings and their labels
            buildings.forEach(building => {
                scene.remove(building);
                building.geometry.dispose();
                building.material.dispose();
            });

            // Cleanup points and their labels
            points.forEach(point => {
                scene.remove(point);
                point.geometry.dispose();
                point.material.dispose();
            });

            // Cleanup point labels
            pointLabels.forEach(label => {
                scene.remove(label);
                if (label.userData) {
                    label.userData.texture?.dispose();
                    label.userData.material?.dispose();
                }
            });

            // Cleanup paths
            paths.forEach(path => {
                scene.remove(path);
                path.geometry.dispose();
                path.material.dispose();
                if (path.userData && path.userData.label) {
                    path.userData.label.userData.texture?.dispose();
                    path.userData.label.userData.material?.dispose();
                    scene.remove(path.userData.label);
                }
            });

            // Cleanup arrows
            directionArrows.forEach(arrow => {
                if (arrow.userData) {
                    arrow.userData.geometries?.forEach(geometry => geometry.dispose());
                    arrow.userData.materials?.forEach(material => material.dispose());
                }
                scene.remove(arrow);
            });

            // Cleanup platform
            scene.remove(platform);
            platform.geometry.dispose();
            platform.material.dispose();

            // Cleanup pins
            scene.remove(pin);
            pin.geometry.dispose();
            pin.material.dispose();
            if (pin.userData.label) {
                pin.userData.label.userData.texture?.dispose();
                pin.userData.label.userData.material?.dispose();
                scene.remove(pin.userData.label);
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

    // Function to create direction arrows between points
    const createDirectionArrow = (startPoint, endPoint) => {
        // Calculate direction and length
        const direction = new THREE.Vector3(
            endPoint.x - startPoint.x,
            0,
            endPoint.z - startPoint.z
        );
        const length = direction.length();
        direction.normalize();

        // Create arrow body (cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, length, 8);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xFFEB00 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

        // Create arrow head (cone)
        const headGeometry = new THREE.ConeGeometry(1, 2, 8);
        const headMaterial = new THREE.MeshBasicMaterial({ color: 0xFFEB00 });
        const head = new THREE.Mesh(headGeometry, headMaterial);

        // Create a container for the arrow parts
        const arrowContainer = new THREE.Group();
        arrowContainer.add(body);
        arrowContainer.add(head);

        // Store geometries and materials for disposal
        arrowContainer.userData = {
            geometries: [bodyGeometry, headGeometry],
            materials: [bodyMaterial, headMaterial]
        };

        // Position body
        body.position.y = 1;
        body.rotation.z = -Math.PI / 2;
        body.position.x = length / 2;

        // Position head
        head.position.y = 1;
        head.rotation.z = -Math.PI / 2;
        head.position.x = length;

        // Position and rotate the entire arrow
        arrowContainer.position.set(
            startPoint.x,
            0,
            startPoint.z
        );

        // Calculate rotation angle
        const angle = Math.atan2(direction.z, direction.x);
        arrowContainer.rotation.y = -angle;

        return arrowContainer;
    };

    // Modified setTargetLocation function
    const setTargetLocation = (selectedBuildingData) => {
        if (targetPin && userPin && senaryo) {
            // Find nearest points to user and target
            const buildingPosition = {
                x: selectedBuildingData.params[4].x,
                z: selectedBuildingData.params[4].z
            };

            const startPoint = findNearestPoint({
                x: userPin.position.x,
                z: userPin.position.z
            });

            const endPoint = findNearestPoint(buildingPosition);

            // Find path between points
            const path = findPath(startPoint, endPoint);

            if (path) {
                // Clear existing direction arrows
                directionArrows.forEach(arrow => {
                    // Dispose of geometries and materials
                    if (arrow.userData) {
                        arrow.userData.geometries?.forEach(geometry => geometry.dispose());
                        arrow.userData.materials?.forEach(material => material.dispose());
                    }
                    senaryo.remove(arrow);
                });
                directionArrows.length = 0;

                // Create arrows between consecutive points
                for (let i = 0; i < path.length - 1; i++) {
                    const arrow = createDirectionArrow(path[i], path[i+1]);
                    senaryo.add(arrow);
                    directionArrows.push(arrow);
                }

                // Set target pin position
                targetPin.position.set(endPoint.x, 2, endPoint.z);
                if (targetPin.userData.label) {
                    targetPin.userData.label.position.set(endPoint.x, 5, endPoint.z);
                    targetPin.userData.label.userData.text = endPoint.name;
                }
            }
        }
        setIsModalOpen(false);
    };




    return (
        <UsersLayout title="Map" user={auth.user}>
            <div ref={mountRef} style={{ width: '100%', height: '100vh' }}></div>

            {/* Location Focus Button */}
            <button
                onClick={focusOnUserPin}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '50px',
                    padding: '10px 20px',
                    backgroundColor: '#C30E59',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                <FaLocationCrosshairs />
            </button>

            {/* Open Modal Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '120px',
                    padding: '10px 20px',
                    backgroundColor: '#ff0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                <FaLocationDot />

            </button>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '300px'
                    }}>
                        <h2 style={{ marginBottom: '20px' }}>Select Destination</h2>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {buildingsData.map((building, index) => (
                                <button
                                    key={index}
                                    onClick={() => setTargetLocation(building)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '10px',
                                        margin: '5px 0',
                                        textAlign: 'left',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        backgroundColor: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {building.params[6]} {/* Building name */}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </UsersLayout>
    );
}
