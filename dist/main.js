var type = 0;
const prpy = 'secShow';
var offset, camera;
var bgm = document.getElementById('bgm');
var enterForm = document.getElementById('enters')
var moonForm = document.getElementById('moons');
var earthForm = document.getElementById('earths');
var sunForm = document.getElementById('suns');
var gameForm = document.getElementById('Game');



window.addEventListener('load', () => {
    init();
});

enterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    bgm.play();
    sec0.classList.remove(prpy);
    SeCo.classList.add(prpy);
    sec1.classList.add(prpy);
    type = 1;
});

moonForm.addEventListener('submit', (e) => {
    e.preventDefault();
    secG.classList.remove(prpy);
    sec3.classList.remove(prpy);
    sec1.classList.remove(prpy);
    sec2.classList.add(prpy);
    type = 2;
});

earthForm.addEventListener('submit', (e) => {
    e.preventDefault();
    secG.classList.remove(prpy);
    sec3.classList.remove(prpy);
    sec2.classList.remove(prpy);
    sec1.classList.add(prpy);
    type = 1;
});

sunForm.addEventListener('submit', (e) => {
    e.preventDefault();
    secG.classList.remove(prpy);
    sec1.classList.remove(prpy);
    sec2.classList.remove(prpy);
    sec3.classList.add(prpy);
    type = 3;
});

gameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sec3.classList.remove(prpy);
    sec2.classList.remove(prpy);
    sec1.classList.remove(prpy);
    secG.classList.add(prpy);
    type = 100;
});

function init() {
    sec0.classList.add(prpy);
    const width = window.innerWidth;
    const height = window.innerHeight;
    //レンダラー作成
    var renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#mainCanvas'),
        alpha: true,
        antialias: true
    });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    //シーン作成
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 50, 10000);
    //カメラ作成
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 0, 700); //カメラ位置設定

    //カメラコントローラ作成
    // const controls = new THREE.OrbitControls(camera, document.querySelector('#mainCanvas'));
    // //滑らかに制御する
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.2;

    //テクスチャ
    const Texloader = new THREE.TextureLoader();
    const Etexture = Texloader.load('./earthmap1k.jpg');
    const Ctexture = Texloader.load('./2k_earth_clouds.png');
    const Mtexture = Texloader.load('./moonmap2k.jpg');
    const Stexture = Texloader.load('./2k_sun.jpg')

    //地球作成
    //メッシュオブジェクト作成
    const Egeometry = new THREE.SphereGeometry(150, 100, 100);
    const Ematerial = new THREE.MeshStandardMaterial({
        map: Etexture, bumpMap: Etexture,roughness: 0.9, specular: 0xcccccc, shininess:50, ambient: 0xffffff
    });

    const earth = new THREE.Mesh(Egeometry, Ematerial);
    earth.position.x = +225;
    earth.castShadow = true;
    //シーンに追加
    scene.add(earth);

    //雲作成
    const ECgeometry = new THREE.SphereGeometry(151, 100, 100);
    const ECmaterial = new THREE.MeshLambertMaterial({
        map: Ctexture,bumpMap: Ctexture , transparent: true
    });

    const cloud = new THREE.Mesh(ECgeometry, ECmaterial);
    cloud.position.x = +225;
    cloud.castShadow = true;

    scene.add(cloud);
    //地球ここまで

    //月作成
    const Mgeometry = new THREE.SphereGeometry(25, 100, 100);
    const Mmaterial = new THREE.MeshStandardMaterial({
        map: Mtexture,bumpMap: Mtexture,roughness: 1,specular: 0xcccccc, shininess:5, ambient: 0xffffff
    });

    const moon = new THREE.Mesh(Mgeometry, Mmaterial);
    moon.rotation.z = -0.6;
    moon.position.x = +500;
    moon.position.y = +100;
    moon.castShadow = true;
    //シーンに追加
    scene.add(moon);
    //月ここまで

    //太陽作成
    const Sgeometry = new THREE.SphereGeometry(300, 100, 100);
    const Smaterial = new THREE.MeshPhongMaterial({
        map: Stexture, specular: 0xcccccc, lightMap: Stexture, shininess:50, ambient: 0xffffff
    });
    const sun = new THREE.Mesh(Sgeometry, Smaterial);
    sun.position.set(5000, 200, 0);

    scene.add(sun);

    const SAgeometry = new THREE.SphereGeometry(301, 100, 100);
    const SAmaterial = new THREE.MeshPhongMaterial({
        map: Stexture,transparent: true, opacity: 0.5, specular: 0xcccccc, lightMap: Stexture, shininess:150, ambient: 0xffffff
    });
    const sunA = new THREE.Mesh(SAgeometry, SAmaterial);
    sunA.position.set(5000, 200, 0);
    

    scene.add(sunA);
    //太陽ここまで

    //ライトを作成
    const Plight = new THREE.PointLight(0xffdcb6, 3, 100000);
    // light.intensity = 1; //ライトの強さを二倍に
    Plight.position.set(5000, 200, 0);
    Plight.castShadow = true;
    Plight.shadowMapWidth = 2048; 
    Plight.shadowMapHeight = 2048;
    //シーンに追加
    scene.add(Plight);

    const Alight = new THREE.AmbientLight(0x55346b, 0.9);
    scene.add(Alight);

    //宇宙飛行船
    const gltfLoader = new THREE.GLTFLoader();   //GLTFローダーを定義
    const glUrl = '../spacePlane.glb';     //読み込むglbファイルのパス
    var spacePlane;
    gltfLoader.load(glUrl, (gltf) => {     //読み込み
        spacePlane = gltf.scene;
        spacePlane.scale.set(10, 10, 10);
        spacePlane.position.set(0, -10, 300);
        spacePlane.receiveShadow = true;
        scene.add(spacePlane);
    });
    

    //補助線 (ヘルパー)
    // var axis = new THREE.AxesHelper(1000);
    // axis.position.set(0,0,0);
    // scene.add(axis);

    // const plane2 = new THREE.GridHelper(1000);
    // scene.add(plane2);

    // var cameraHelper = new THREE.CameraHelper(camera);
    // scene.add(cameraHelper);

    // const pointLightHelper = new THREE.PointLightHelper( light, 1);
    // scene.add( pointLightHelper );

    //ここまで(ヘルパー)


    //月の公転用値
    var angle = 0;
    var circleCenterX = 255;  //軌道の中心(X座標)
    var circleCenterY = 0;    //軌道の中心(Y座標)
    var radius = 275;

    //リサイズ処理
    window.addEventListener('resize', respsize);

    function respsize() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    //宇宙船移動 type == 100 の時のみ

    window.addEventListener('keydown', (e) => {
        var keycode = e.key
        console.log(keycode); //デバッグ用後で消す
        SPMove(keycode);
    });
    
    function SPMove(value) {
            if (value == 'a' || value == 'ArrowLeft') {
                spacePlane.rotation.y += 0.08;
            }
            if (value == 's' || value == 'ArrowDown') {
                spacePlane.translateZ(3);
            }
            if (value == 'd' || value == 'ArrowRight') {
                spacePlane.rotation.y -= 0.08;
            }
            if (value == 'w' || value == 'ArrowUp') {
                spacePlane.translateZ(-3);
            }

            
    }
    //ここまで（移動）

    //レンダー・アニメーション
    animation();

    function animation() {
        earth.rotation.y += 0.0005;
        cloud.rotation.y += 0.001;
        moon.rotation.y += 0.002;
        sun.rotation.y += 0.001;
        sunA.rotation.z -= 0.001;
        //円軌道で動かす
        angle += 0.002;
        moon.position.x = circleCenterX + radius*Math.cos(angle);
        moon.position.z = circleCenterY + radius*Math.sin(angle);
        moon.position.y = circleCenterY + radius*Math.cos(angle);

        if (type == 2) {
            offset= new THREE.Vector3(moon.position.x + 145, moon.position.y + 151, moon.position.z + 135);
            camera.position.lerp(offset, 0.01);
            camera.lookAt(moon.position);
        } else if(type == 0) {
            offset= new THREE.Vector3(0, 500, 700);
            camera.position.lerp(offset, 0.01);
            camera.lookAt(-1000, -100, -100);
        }else if(type == 1) {
            offset= new THREE.Vector3(300, 200, 350);
            camera.position.lerp(offset, 0.01);
            camera.lookAt(earth.position.x, earth.position.y, earth.position.z/*0, 0, 0*/);
        } else if(type == 3) {
            offset = new THREE.Vector3(sun.position.x + 345, sun.position.y + 351, sun.position.z + 535);
            camera.position.lerp(offset, 0.01);
            camera.lookAt(sun.position);
        } else if(type == 100) {
            offset = new THREE.Vector3(spacePlane.position.x -235, spacePlane.position.y +290, spacePlane.position.z + 10);
            camera.position.lerp(offset, 0.01);
            camera.lookAt(spacePlane.position);
        }

        // controls.update();

        renderer.render(scene, camera);

        requestAnimationFrame(animation);
    }
}
