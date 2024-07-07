import '../styles/main.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { lerp } from './utils' 

import image from '../images/01.jpg'
import vertexShader from '../shaders/distorded-pixel/vertex.glsl'
import fragmentShader from '../shaders/distorded-pixel/fragment.glsl'

class App {
  constructor() {

    this.img = document.querySelector('img')

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

    this.time = 0

    // const textureLoader = new THREE.TextureLoader()
    // textureLoader.load(image, (texture) => {
      // this.imageTexture = texture

      this.getSizes()
      this.createRenderer()
      this.createScene()
      this.createCamera()
      this.createPlane()
      this.onResize()
      this.createGui()
  
      this.addEventListeners()
  
      this.render()
    // })

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
    this.scene = new THREE.Scene()
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera( 70, this.sizes.width / this.sizes.height, 0.1, 1000 )
    this.camera.position.z = 5
    this.camera.updateProjectionMatrix()
    this.scene.add(this.camera)
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

  generateGrid() {
    const data = new Float32Array(32 * 32 * 3)
    const color = new THREE.Color(0xffffff)

    const r = Math.floor(color.r * 255)
    const g = Math.floor(color.g * 255)
    const b = Math.floor(color.b * 255)

    for (let i = 0; i < 32 * 32; i++) {
      let r = Math.random() * 255 - 125
      let r1 = Math.random() * 255 - 125

      data[i * 3] = r
      data[i * 3 + 1] = r1
      data[i * 3 + 2] = r
    }

    this.texture = new THREE.DataTexture(data, 32, 32, THREE.RGBFormat, THREE.FloatType)
    this.texture.magFilter = this.texture.minFilter = THREE.NearestFilter


    if (this.material) {
      this.material.uniforms.uDataTexture.value = this.texture
      this.material.uniforms.uDataTexture.value.needsUpdate = true
    }
  }


  createPlane() {
    // Generate Grid Texture
    this.generateGrid()

    let imageTexture = new THREE.Texture(this.img)
    imageTexture.needsUpdate = true;

    // Image Texture
    // const imageTexture = new THREE.Texture(this.imageTexture)
    // console.log(imageTexture);
    // imageTexture.needsUpdate = true


    // Create material
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector4() },
        uTexture: { value: imageTexture },
        uDataTexture: { value: this.texture }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })


    // Create geometry
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

    // Create plane
    this.plane = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.plane)
  }

  /**
   * Events
   */

  onResize() {
    this.getSizes()
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.renderer.setSize( this.sizes.width, this.sizes.height )
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Image cover
    this.imageAspect = 1. / 1.5
    let a1, a2
    if (this.sizes.width / this.sizes.height < this.imageAspect) {
      a1 = 1
      a2 = this.sizes.width / this.sizes.height / this.imageAspect
    } else {
      a1 = (this.sizes.height * this.imageAspect) / this.sizes.width
      a2 = 1
    }

    this.material.uniforms.uResolution.value.x = this.sizes.width
    this.material.uniforms.uResolution.value.y = this.sizes.height
    this.material.uniforms.uResolution.value.z = a1
    this.material.uniforms.uResolution.value.w = a2

    this.camera.updateProjectionMatrix()
    this.generateGrid()
  }

  onMouseMove(event) {
    this.mouse.target.x = event.clientX / this.sizes.width
    this.mouse.target.y = event.clientY / this.sizes.height
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  render() {
    //
    // this.mouse.current.x = lerp(this.mouse.current.x, this.mouse.target.x, 0.1)
    // this.mouse.current.y = lerp(this.mouse.current.y, this.mouse.target.y, 0.1)

    // Update time and uniform
    this.time += 0.05
    this.material.uniforms.uTime.value = this.time

    window.requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
  }
}

const app = new App()