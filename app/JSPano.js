var JSPano = new Class({
    
    Implements: [Options],
    
    Binds: [
        'onMouseDown',
        'onMouseMove',
        'onMouseUp',
        'onMouseWheel',
        'animate'
    ],

    camera: null,
    scene: null,
    renderer: null,
    
    fov: 70,
    isUserInteracting: false,
    onMouseDownMouseX: 0,
    onMouseDownMouseY: 0,
    lon: 0,
    onMouseDownLon: 0,
    lat: 0,
    onMouseDownLat: 0,
    phi: 0,
    theta: 0,
    size: {},
    
    options: {
        viewAngle: 70,
        near: 1,
        far: 1100
    },
    
    initialize: function(container, panoramaImage, options){
        this.setOptions(options);
    
        this.container = $(container);
        this.size = this.container.getSize();
        this.fov = this.options.viewAngle;
        
        var mesh;
        
        this.camera = new THREE.Camera(this.fov, this.size.x / this.size.y, this.options.near, this.options.far);
        
        this.scene = new THREE.Scene();
        
        mesh = new THREE.Mesh(new THREE.SphereGeometry(500, 60, 40), new THREE.MeshBasicMaterial({ 
            map: THREE.ImageUtils.loadTexture(panoramaImage) 
        }));
        mesh.scale.x = -1;
        this.scene.addObject(mesh);
        
        //this.renderer = new THREE.WebGLRenderer();
        //this.renderer = new THREE.CanvasRenderer();
        this.renderer = new THREE.DOMRenderer();
        this.renderer.setSize(this.size.x, this.size.y);
        
        this.container.appendChild(this.renderer.domElement);
        
        document.addEvents({
            mousedown: this.onMouseDown.bind(this),
            mousemove: this.onMouseMove.bind(this),
            mouseup: this.onMouseUp.bind(this),
            mousewheel: this.onMouseWheel.bind(this)
        });
    
        this.layout();
        this.animate();
    },
    
    layout: function(){
        this.container.setStyle('cursor', 'move');
    },
    
    onMouseDown: function(e){
        e.preventDefault();
        
        this.isUserInteracting = true;
        
        this.onPointerDownPointerX = e.client.x;
        this.onPointerDownPointerY = e.client.y;
        
        this.onPointerDownLon = this.lon;
        this.onPointerDownLat = this.lat;
    },
    
    onMouseMove: function(e) {
        if(this.isUserInteracting) {
            
            this.lon = (this.onPointerDownPointerX - e.client.x) * 0.1 + this.onPointerDownLon;
            this.lat = (e.client.y - this.onPointerDownPointerY) * 0.1 + this.onPointerDownLat;

        }
    },
    
    onMouseUp: function(e) {
        this.isUserInteracting = false;
    },
    
    onMouseWheel: function(e) {
        
        console.log(e.wheel);
        
        this.fov -= e.wheel * 0.05;
        
        this.camera.projectionMatrix = THREE.Matrix4.makePerspective(this.fov, this.size.x / this.size.y, this.options.near, this.options.far);
        this.render();
    },
    
    zoomIn: function(){
        this.fov -= 0.5;
        
        this.camera.projectionMatrix = THREE.Matrix4.makePerspective(this.fov, this.size.x / this.size.y, this.options.near, this.options.far);
        this.render();
    },
    
    zoomOut: function(){
        this.fov += 0.5;
        
        this.camera.projectionMatrix = THREE.Matrix4.makePerspective(this.fov, this.size.x / this.size.y, this.options.near, this.options.far);
        this.render();
    },
    
    animate: function() {
        window.requestAnimationFrame(this.animate);
        this.render();
    },
    
    render: function() {
        
        this.lat = Math.max(-85, Math.min( 85, this.lat));
        this.phi = (90 - this.lat) * Math.PI / 180;
        this.theta = this.lon * Math.PI / 180;
        
        this.camera.target.position.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
        this.camera.target.position.y = 500 * Math.cos(this.phi);
        this.camera.target.position.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);
        
        /*
        // distortion
        camera.position.x = - camera.target.position.x;
        camera.position.y = - camera.target.position.y;
        camera.position.z = - camera.target.position.z;
        */
        
        this.renderer.render(this.scene, this.camera);
    }
});