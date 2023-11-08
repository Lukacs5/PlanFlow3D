import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import * as THREE from 'three';
import { Mesh } from 'three';

interface STLModelProps {
  url: string;
}

const STLModel: React.FC<STLModelProps> = ({ url }) => {
  const geometry = useLoader(STLLoader, url);
  const material = new THREE.MeshPhongMaterial({ color: new THREE.Color('skyblue') });
  // Initialize the ref with `null` as the default value
  const meshRef = useRef<Mesh>(null);

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
};

export default STLModel;
