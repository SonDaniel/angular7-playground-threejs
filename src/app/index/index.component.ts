import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
  Scene, PerspectiveCamera, WebGLRenderer,
  BoxGeometry, MeshBasicMaterial, Mesh, SphereGeometry,
  MeshPhongMaterial, AmbientLight, DirectionalLight,
  TextureLoader, Color
} from 'three';
// import * as THREE from 'three' (you will have to reference everything with ex: THREE.Scene )
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PI = 3.14159;
const TEXTURE_MAP = 'https://2.bp.blogspot.com/-Jfw4jY6vBWM/UkbwZhdKxuI/AAAAAAAAK94/QTmtnuDFlC8/s1600/2_no_clouds_4k.jpg';
const TEXTURE_BUMP_MAP = 'https://2.bp.blogspot.com/-oeguWUXEM8o/UkbyhLmUg-I/AAAAAAAAK-E/kSm3sH_f9fk/s1600/elev_bump_4k.jpg';
const TEXTURE_SPECULAR_MAP = 'https://1.bp.blogspot.com/-596lbFumbyA/Ukb1cHw21_I/AAAAAAAAK-U/KArMZAjbvyU/s1600/water_4k.png';
/**
 * What is @Component:
 * Selector   : HTML dom element that you want this component to be named.
 *              Check out app.component.html
 * 
 * templateUrl: The HTML file that this component is attached to.
 * 
 * StyleUrls  : The CSS file that this component is attached to.
 *              You can also use SCSS (SASS) tutorial:
 *              https://medium.com/@vissanu_s/quick-tip-how-to-use-scss-in-angular-cli-6-63d263b3481c 
 * 
 * More info on @Component: https://angular.io/api/core/Component
 */
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  // Initializing global variables
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer = new WebGLRenderer();
  controls: OrbitControls;

  earthMesh: any;
  /**
   * Constructor is only called once when the class IndexComponent is being initialized
   */
  constructor() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 20;
    this.scene.add(this.camera);
  }

  /**
   * ngOnInit part of angular component lifecycle. Same goes for ngAfterViewInit
   * When Component is removed from the DOM and then re-added, ngOnInit will be called again
   * Check out: https://angular.io/guide/lifecycle-hooks#lifecycle-sequence
   */
  ngOnInit() { }

  ngAfterViewInit() {
    // setting up renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // setting up controls for moving view
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.enablePan = false;
    this.controls.maxPolarAngle = PI;
    this.controls.autoRotateSpeed = 1.0;

    // add lights to scene
    this.scene.add(new AmbientLight(0x333333));
    var light = new DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    this.camera.add(light);

    var geometry = new SphereGeometry(10, 100, 100);

    // load in texture files
    var textureLoader = new TextureLoader();
    var material = new MeshPhongMaterial();

    // load in all the texture files async on callback
    textureLoader.load(TEXTURE_MAP, (texture) => {
      this.earthMesh.material.setValues({ map: texture });
      this.earthMesh.material.needsUpdate = true;
    });

    textureLoader.load(TEXTURE_BUMP_MAP, (texture) => {
      this.earthMesh.material.setValues({ bumpMap: texture });
      this.earthMesh.material.needsUpdate = true;
    });

    textureLoader.load(TEXTURE_SPECULAR_MAP, (texture) => {
      this.earthMesh.material.setValues({ specularMap: texture });
      this.earthMesh.material.needsUpdate = true;
    });

    // create mesh and add to scene
    this.earthMesh = new Mesh(geometry, material);
    this.scene.add(this.earthMesh);

    // call the animate loop
    this.animate();
  }

  animate() {
    window.requestAnimationFrame(() => this.animate());

    // required for autoRotate
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

}
