import {
	Scene,
	Color,
	BoxGeometry,
	Mesh,
	MeshStandardMaterial,
	PointLight,
	SphereGeometry
} from 'three';

class RoomEnvironment extends Scene {

	constructor() {

		super();

		this.background = new Color(0x404040);

		const geometry = new BoxGeometry();
		geometry.deleteAttribute('uv');

		const roomMaterial = new MeshStandardMaterial({ side: 1 });
		const box = new Mesh(geometry, roomMaterial);
		box.scale.set(10, 10, 10);
		this.add(box);

		const light1 = new PointLight(0xffffff, 50, 0);
		light1.position.set(0, 5, 0);
		this.add(light1);

		const light2 = new PointLight(0xffffff, 50, 0);
		light2.position.set(5, 5, 5);
		this.add(light2);

		const light3 = new PointLight(0xffffff, 50, 0);
		light3.position.set(-5, 5, 5);
		this.add(light3);

		const light4 = new PointLight(0xffffff, 50, 0);
		light4.position.set(0, 5, -5);
		this.add(light4);

		const sphereGeometry = new SphereGeometry(0.5, 16, 8);
		const sphereMaterial = new MeshStandardMaterial({ color: 0xffffff });

		const lightSphere1 = new Mesh(sphereGeometry, sphereMaterial);
		lightSphere1.position.set(0, 5, 0);
		this.add(lightSphere1);

		const lightSphere2 = new Mesh(sphereGeometry, sphereMaterial);
		lightSphere2.position.set(5, 5, 5);
		this.add(lightSphere2);

		const lightSphere3 = new Mesh(sphereGeometry, sphereMaterial);
		lightSphere3.position.set(-5, 5, 5);
		this.add(lightSphere3);

		const lightSphere4 = new Mesh(sphereGeometry, sphereMaterial);
		lightSphere4.position.set(0, 5, -5);
		this.add(lightSphere4);
	}

}

export { RoomEnvironment };
