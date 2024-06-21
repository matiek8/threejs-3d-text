import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js'

/**
 * Base
 */
// Debug
// const gui = new GUI()


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/** 
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {

        addEventListener('dblclick', () => {
            updateMaterial()
        })

        const textGeometry = new TextGeometry(
            'matiek8',
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.computeBoundingBox()
        console.log(textGeometry.boundingBox)


        const matcapMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        const basicMaterial = new THREE.MeshBasicMaterial()
        basicMaterial.wireframe = true
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5  // Subtract bevel thickness
        // )

        textGeometry.center()
        
        const text = new THREE.Mesh(textGeometry, matcapMaterial)
        scene.add(text)

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const donutList = []
        for(let i = 0; i < 500; i++)
        {
            const donut = new THREE.Mesh(donutGeometry, matcapMaterial)
            donutList.push(donut)
            scene.add(donut)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
        }

        const updateMaterial = ()=> {
            if (text.material instanceof THREE.MeshMatcapMaterial) {
                text.material = basicMaterial
                donutList.map(donut=> donut.material = basicMaterial)
            } else {
                text.material = matcapMaterial
                donutList.map(donut=> donut.material = matcapMaterial)
            }
        }
    }
)


/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1


scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    const radius = 1; // Radius of the circular path
    const speed = 0.05; // Speed of the camera movement
    camera.position.x = radius * Math.cos(elapsedTime * speed);
    camera.position.y = radius * Math.cos(elapsedTime * speed)
    camera.position.z = radius * Math.sin(elapsedTime * speed);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Make the camera look at the object

    renderer.render(scene, camera);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()