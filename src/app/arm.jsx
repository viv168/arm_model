import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";

export default function Arm() {
  const { camera } = useThree();
  const upperArmRef = useRef(null);
  const lowerArmRef = useRef(null);
  const dragPlaneRef = useRef(null);
  const [activeJoint, setActiveJoint] = useState(null);
  
  // Target quaternions for smooth interpolation
  const upperArmTargetQuaternion = useRef(new THREE.Quaternion());
  const lowerArmTargetQuaternion = useRef(new THREE.Quaternion());
  
  // Current quaternions
  const upperArmCurrentQuaternion = useRef(new THREE.Quaternion());
  const lowerArmCurrentQuaternion = useRef(new THREE.Quaternion());
  
  // Raycasting and mouse position
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const intersectionPointRef = useRef(new THREE.Vector3());
  
  // Animation smoothing factor (lower = smoother but slower)
  const smoothingFactor = 0.1;

  // Initialize quaternions
  useEffect(() => {
    if (upperArmRef.current) {
      upperArmCurrentQuaternion.current.copy(upperArmRef.current.quaternion);
      upperArmTargetQuaternion.current.copy(upperArmRef.current.quaternion);
    }
    if (lowerArmRef.current) {
      lowerArmCurrentQuaternion.current.copy(lowerArmRef.current.quaternion);
      lowerArmTargetQuaternion.current.copy(lowerArmRef.current.quaternion);
    }
  }, []);

  useFrame(({ mouse, camera }) => {
    // Update mouse position
    mouseRef.current.set(mouse.x, mouse.y);
    
    // Update the drag plane to always face the camera
    if (dragPlaneRef.current) {
      dragPlaneRef.current.lookAt(camera.position);
    }
    
    if (activeJoint) {
      // Cast ray from mouse to get 3D position
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObject(dragPlaneRef.current);
      
      if (intersects.length > 0) {
        // Store the intersection point
        intersectionPointRef.current.copy(intersects[0].point);
        
        // Determine which joint is active and calculate target rotation
        if (activeJoint === "shoulder") {
          calculateTargetRotation(upperArmRef, upperArmTargetQuaternion);
        } else if (activeJoint === "elbow") {
          calculateTargetRotation(lowerArmRef, lowerArmTargetQuaternion);
        }
      }
    }
    
    // Apply smooth interpolation to the rotations
    if (upperArmRef.current) {
      upperArmRef.current.quaternion.slerp(upperArmTargetQuaternion.current, smoothingFactor);
      upperArmCurrentQuaternion.current.copy(upperArmRef.current.quaternion);
    }
    
    if (lowerArmRef.current && activeJoint === "elbow") {
      lowerArmRef.current.quaternion.slerp(lowerArmTargetQuaternion.current, smoothingFactor);
      lowerArmCurrentQuaternion.current.copy(lowerArmRef.current.quaternion);
    }
  });
  
  // Calculate target rotation based on cursor position
  const calculateTargetRotation = (jointRef, targetQuaternion) => {
    if (!jointRef.current) return;
    
    // Get the joint's world position
    const jointPosition = new THREE.Vector3();
    jointRef.current.getWorldPosition(jointPosition);
    
    // Calculate direction from joint to cursor
    const direction = new THREE.Vector3().subVectors(intersectionPointRef.current, jointPosition).normalize();
    
    // Create a quaternion that rotates from the initial direction to the target direction
    const initialDirection = new THREE.Vector3(0, 1, 0); // Assuming the arm points up initially
    
    // Create a rotation that aligns the initial direction with the target direction
    const rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.setFromUnitVectors(initialDirection, direction);
    
    // Apply joint constraints (optional - can be customized based on needs)
    applyJointConstraints(rotationQuaternion, activeJoint);
    
    // Set the target quaternion
    targetQuaternion.current.copy(rotationQuaternion);
  };
  
  // Apply constraints to prevent unnatural rotations
  const applyJointConstraints = (quaternion, jointType) => {
    // Convert quaternion to euler angles for easier constraint application
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    
    // Apply different constraints based on joint type
    if (jointType === "shoulder") {
      // Shoulder constraints
      euler.x = THREE.MathUtils.clamp(euler.x, -Math.PI/2, Math.PI/2);
      euler.z = THREE.MathUtils.clamp(euler.z, -Math.PI/2, Math.PI/2);
    } else if (jointType === "elbow") {
      // Elbow constraints - typically more limited than shoulder
      euler.x = THREE.MathUtils.clamp(euler.x, -Math.PI/3, Math.PI/3);
      euler.z = THREE.MathUtils.clamp(euler.z, -Math.PI/3, Math.PI/3);
    }
    
    // Convert back to quaternion
    quaternion.setFromEuler(euler);
  };

  const handleJointPointerDown = (joint) => (event) => {
    event.stopPropagation();
    setActiveJoint(joint);
    
    // Update the drag plane position to be at the joint
    if (dragPlaneRef.current && event.object) {
      const worldPosition = new THREE.Vector3();
      event.object.getWorldPosition(worldPosition);
      dragPlaneRef.current.position.copy(worldPosition);
    }
  };

  const handlePointerUp = () => {
    setActiveJoint(null);
  };

  const handlePointerMissed = () => {
    setActiveJoint(null);
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Invisible drag plane that follows camera */}
      <mesh 
        ref={dragPlaneRef} 
        visible={false} 
        position={[0, 0, 0]} 
        scale={100}
      >
        <planeGeometry />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#303030" />
      </mesh>

      {/* Upper Arm */}
      <group ref={upperArmRef}>
        <Sphere
          args={[0.2, 32, 32]}
          position={[0, 0, 0]}
          onPointerDown={handleJointPointerDown("shoulder")}
          onPointerUp={handlePointerUp}
          castShadow
        >
          <meshStandardMaterial color="#4285F4" />
        </Sphere>
        <Cylinder args={[0.1, 0.1, 2]} position={[0, 1, 0]} castShadow>
          <meshStandardMaterial color="#808080" metalness={0.7} roughness={0.3} />
        </Cylinder>

        {/* Lower Arm */}
        <group ref={lowerArmRef} position={[0, 2, 0]}>
          <Sphere
            args={[0.2, 32, 32]}
            position={[0, 0, 0]}
            onPointerDown={handleJointPointerDown("elbow")}
            onPointerUp={handlePointerUp}
            castShadow
          >
            <meshStandardMaterial color="#EA4335" />
          </Sphere>
          <Cylinder args={[0.1, 0.1, 2]} position={[0, 1, 0]} castShadow>
            <meshStandardMaterial color="#A9A9A9" metalness={0.7} roughness={0.3} />
          </Cylinder>

          {/* Hand */}
          <group position={[0, 2, 0]}>
            <Cylinder args={[0.15, 0.08, 0.4]} position={[0, 0.2, 0]} castShadow>
              <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.2} />
            </Cylinder>
            {/* Fingers */}
            {[...Array(3)].map((_, i) => (
              <Cylinder
                key={i}
                args={[0.03, 0.03, 0.3]}
                position={[
                  Math.cos((i * Math.PI) / 3) * 0.1, 
                  0.5, 
                  Math.sin((i * Math.PI) / 3) * 0.1
                ]}
                rotation={[Math.PI / 6, 0, 0]}
                castShadow
              >
                <meshStandardMaterial color="#808080" metalness={0.6} roughness={0.4} />
              </Cylinder>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}