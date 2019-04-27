import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
  Scene, PerspectiveCamera, WebGLRenderer,
  BoxGeometry, MeshBasicMaterial, Mesh, SphereGeometry,
  MeshPhongMaterial, AmbientLight, DirectionalLight,
  TextureLoader, Color
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// import * as THREE from 'three' (you will have to reference everything with ex: THREE.Scene )

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

  /**
   * Constructor is only called once when the class IndexComponent is being initialized
   */
  constructor() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 3;
    this.scene.add(this.camera);
  }

  /**
   * ngOnInit part of angular component lifecycle. Same goes for ngAfterViewInit
   * When Component is removed from the DOM and then re-added, ngOnInit will be called again
   * Check out: https://angular.io/guide/lifecycle-hooks#lifecycle-sequence
   */
  ngOnInit() {}

  ngAfterViewInit() {
    // setting up renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // setting up controls for moving view
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 3.0;


    this.scene.add(new AmbientLight(0x333333));

    var light = new DirectionalLight(0xffffff, 1);
    light.position.set(5,3,5);
    this.camera.add(light);

    var geometry = new SphereGeometry(1, 100, 100);

    // load in texture files
    var textureLoader = new TextureLoader();
    var textureMap, textureBumpMap, textureSpecMap;

    textureLoader.load('assets/images/2_no_clouds_4k.jpg', (texture) => {
      textureMap = texture;
      console.log('texturemap loaded');
    });

    textureLoader.load('assets/images/elev_bump_4k.jpg', (texture) => {
      textureBumpMap = texture;
      console.log('textureBumpMap loaded');
    });
    textureLoader.load('assets/images/water_4k.png', (texture) => {
      textureSpecMap = texture;
      console.log('textureSpecMap loaded');
    });

    var material = new MeshPhongMaterial({
      map: textureMap,
      bumpMap: textureBumpMap,
      bumpScale: 0.005,
      specularMap: textureSpecMap,
      specular: new Color('grey')
    });
    var earthMesh = new Mesh(geometry, material);
    this.scene.add(earthMesh);
    console.log('scene added earth')
    
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
