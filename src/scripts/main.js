import '../styles/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { lerp } from './utils' 

import image from '../images/01.jpg'
import vertexShader from '../shaders/distorded-pixel/vertex.glsl'
import fragmentShader from '../shaders/distorded-pixel/fragment.glsl'

class App {
  constructor() {

    this.mouse = {
      current: {
        x: 0,
        y: 0
      },
      target: {
        x: 0,
        y: 0
      },
      delta: {
        x: 0,
        y: 0
      }
    }

    this.getSizes()
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.createMesh()
    this.createGui()
    this.createControl()

    this.addEventListeners()

    this.animate()
  }

  getSizes() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  /**
   * Create
   */

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera( 70, this.sizes.width / this.sizes.height, 0.1, 1000 );
    this.camera.position.z = 5;
    this.camera.updateProjectionMatrix();
  }

  createMesh() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      // wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 }
      }
    })


    // Image
    const texture = new THREE.Texture(image)
    this.planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32)
    this.planeMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uTexture: { value: texture }
      }
    })

    this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial)
    this.scene.add(this.planeMesh)
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = THREE.sRGBEncoding
    document.body.appendChild(this.renderer.domElement)
  }

  createGui() {
    const settings = {
      progress: 0
    }
    this.gui = new dat.GUI()
    this.gui.add(settings, 'progress', 0, 1, 0.05)
  }

  createControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
  }

  /**
   * Events
   */

  onResize() {
    this.getSizes()
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.sizes.width, this.sizes.height );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  onMouseMove(event) {
    this.mouse.target.x = event.clientX / this.sizes.width
    this.mouse.target.y = event.clientY / this.sizes.height
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  animate() {
    this.controls.update()
  
    this.mouse.current.x = lerp(this.mouse.current.x, this.mouse.target.x, 0.1)
    this.mouse.current.y = lerp(this.mouse.current.y, this.mouse.target.y, 0.1)

    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.animate.bind(this))
  }
}

const app = new App()