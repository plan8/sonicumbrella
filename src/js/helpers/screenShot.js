var THREE = require('three');

module.exports = function screenShot( renderer, camera, scene ){
  var vS = 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);}';
	var fS = '\nuniform samplerCube cubemapTexture;\nuniform vec2 resolution;\n\nvoid main( void )\n{\n	vec2 texCoord = gl_FragCoord.xy / resolution;\n	vec2 thetaphi = ((texCoord * 2.0) - vec2(1.0)) * vec2(3.1415926535897932384626433832795, 1.5707963267948966192313216916398);\n	vec3 rayDirection = vec3(cos(thetaphi.y) * cos(thetaphi.x), sin(thetaphi.y), cos(thetaphi.y) * sin(thetaphi.x));\n	gl_FragColor = textureCube(cubemapTexture, rayDirection);\n}\n	';
	var width = 4096;
	var height = 4096;
	var sceneEl = renderer.domElement;
	var camScale = 0.15;


	var cubeCamera = new THREE.CubeCamera(0.01, 100000, height);
  //cubeCamera.rotation.order = "YXZ";

	if (window.renderOrigin) {
		cubeCamera.position.copy(window.renderOrigin);
	} else {
		cubeCamera.position.copy(camera.getWorldPosition());
	}
	scene.add(cubeCamera);

	cubeCamera.updateCubeMap(renderer, scene);

	var material = new THREE.ShaderMaterial({

		uniforms: {
			cubemapTexture: cubeCamera.renderTarget.texture ,
			resolution: { value: new THREE.Vector2(width, -height) },
		},
		vertexShader: vS,
		fragmentShader: fS
	});

	window.material = material;
	window.cubeCamera = cubeCamera;

	var orthoCamera = new THREE.OrthographicCamera(0.5 * camScale * width / -height, 0.5 * camScale * width / height, camScale * 0.5, camScale * -0.5, 0.1, 100);

  camera.add(orthoCamera);
	renderer.render(scene, orthoCamera);
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(camScale * width / height, camScale * 1), material);
	orthoCamera.add(plane);
	plane.position.set(0, 0, -1);

	var chromeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: cubeCamera.renderTarget.texture });
	plane.material = chromeMaterial;

	setTimeout(function () {

		plane.material = material;
		var old = renderer.getSize();

		renderer.setSize(width, height);
		renderer.render(scene, orthoCamera);
		window.open(renderer.domElement.toDataURL());
		renderer.setSize(old.width, old.height);

		camera.remove(orthoCamera);

	}, 100);

}
