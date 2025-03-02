import { Environment } from '@/components/3d/Environment' // Import the 3D environment component
import { useState, useEffect, useCallback } from 'react' // Import React hooks for state and memoized functions
import * as THREE from 'three' // Import the Three.js library for 3D rendering
import { gsap } from 'gsap' // Import GSAP for smooth animations
import { Music, Volume2, VolumeX, Menu, Home as HomeIcon } from 'lucide-react' 
import { useAudio } from '../hooks/use-audio'
import { HoloTerminal } from '../components/3d/Terminal' // Import the terminal component
import '../index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBriefcase,
  faCode,
  faProjectDiagram,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';


// make sure this message is only visible for 10 seconds, for the sake of mobile users
const FunkyMessage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10000); // Show after 10 seconds
    const hideTimer = setTimeout(() => setVisible(false), 15000); // Hide after 15 seconds (10 + 5)

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div>
      {visible && (
        <p className="text-sm text-muted-foreground">
          Toggle sound on.
        </p>
      )}
    </div>
  );
};

export default function Home() {
  // State to track the currently active object
  const [activeObject, setActiveObject] = useState<string | null>(null)

  // State to store the camera reference
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null)

  // State to store the camera controls (like OrbitControls)
  const [controls, setControls] = useState<any>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const { playAmbient, stopAmbient } = useAudio()

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const [isActive, setIsActive] = useState(false); // State to manage active status

  // Function to smoothly move the camera to a new position and focus on a target
  const moveCamera = useCallback((position: THREE.Vector3, target: THREE.Vector3, objectId: string) => {
    if (camera && controls) {
      // Animate the camera position using GSAP
      gsap.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 2, // Animation duration (2 seconds)
        ease: "power2.inOut" // Smooth easing function
      })

      // Animate the camera's target (where it's looking)
      gsap.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 2,
        ease: "power2.inOut"
      })

      setActiveObject(objectId) // Update the active object state
    }
  }, [camera, controls]) // Dependencies: function updates when camera or controls change

  useEffect(() => {
    if (camera && controls) {
      // Wait 300ms before starting the sequence.
      setTimeout(() => {
        // First, move the camera to an intermediate position.
        moveCamera(
          new THREE.Vector3(-15, 9, -15),  // Intermediate position
          new THREE.Vector3(0, 0, 0),   // Target remains the same
          'intermediate'
        );

        // After the intermediate move (assume it takes ~2 seconds), move to the final destination.
        setTimeout(() => {
          moveCamera(
            new THREE.Vector3(0, 10, 20), // Final position
            new THREE.Vector3(0, 0, 0),  // Staying with the same target
            'final'
          );
        }, 2500); // 2.5 second delay after moving to the intermediate position
      }, 300); // Initial 300ms delay
    }
  }, [camera, controls, moveCamera])

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopAmbient()
    } else {
      playAmbient()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, playAmbient, stopAmbient])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setActiveObject(null); // Reset active object
    setIsActive(false); // Explicitly set isActive to false
  };

  const handleMenuItemClick = (cameraPosition: THREE.Vector3, target: THREE.Vector3, objectId: string) => {
    moveCamera(cameraPosition, target, objectId);
    setIsMenuOpen(false);
    setIsActive(false);
  };

  // Define the home (PowerCube) camera position and target.
  const homeCameraPosition = new THREE.Vector3(0, 8, 15)
  const homeCameraTarget = new THREE.Vector3(0, 0, 0)

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative">
      {/* 3D Environment Component */}
      <Environment 
        onObjectSelect={moveCamera}
        activeObject={activeObject}
        onControlsReady={setControls}
        onCameraReady={setCamera}
        isActive={isActive}
      />

      {/* Title & Instructions (Fixed at the top-left) */}
      <div className="fixed top-4 left-4 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">HoloDeck <br></br> CV.</h1>
          <button
            onClick={toggleMusic}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={isPlaying ? 'Mute music' : 'Play music'}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-primary" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
        <FunkyMessage />
      </div>

      {/* Hamburger navigation at the top-right */}
      <div className="hamburger-container">
        <button className="hamburger-button" onClick={toggleMenu}>
          <Menu size={24} className="text-primary" />
        </button>
        <ul className={`menu ${isMenuOpen ? "open" : ""}`}>
          <li>
            <button
              onClick={() =>
                handleMenuItemClick(
                  new THREE.Vector3(10, 8, 10),
                  new THREE.Vector3(15, 0, 15),
                  "avatar"
                )
              }
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" /> About Me
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleMenuItemClick(
                  new THREE.Vector3(0, 8, -9),
                  new THREE.Vector3(0, 4, -15),
                  "sphere"
                )
              }
            >
              <FontAwesomeIcon icon={faCode} className="mr-2" /> Skills
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleMenuItemClick(
                  new THREE.Vector3(-10, 5, -5),
                  new THREE.Vector3(-15, 1, -10),
                  "city"
                )
              }
            >
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" /> Experience
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleMenuItemClick(
                  new THREE.Vector3(-7, 3, 6),
                  new THREE.Vector3(-15, 3.5, 10),
                  "terminal"
                )
              }
            >
              <FontAwesomeIcon icon={faProjectDiagram} className="mr-2" /> Projects
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                handleMenuItemClick(
                  new THREE.Vector3(10, 5, 0),  
                  new THREE.Vector3(14, 3, -11),
                  "recommendation"
                )
              }
            >
              <FontAwesomeIcon icon={faThumbsUp} className="mr-2" /> Endorsements
            </button>
          </li>
        </ul>
      </div>

      {/* Home Icon - Fixed at Bottom Right */}
      <button
        onClick={() => moveCamera(homeCameraPosition, homeCameraTarget, 'powerCube')}
        className="fixed bottom-4 right-4 p-2 bg-black/70 text-[#00ff88] rounded-full hover:bg-[rgba(0,255,136,0.2)] transition-colors z-50"
        aria-label="Back to PowerCube"
      >
        <HomeIcon size={24} />
      </button>

      {/* Signature text */}
      <p className="fixed bottom-4 left-4 text-white text-xs z-50">
        Edd Brisley [2025] <br></br> Lets connect on <a href="https://www.linkedin.com/in/edd-brisley/" target="_blank" rel="noopener noreferrer"><u>LinkedIn</u></a></p>
    </div>
  )
}