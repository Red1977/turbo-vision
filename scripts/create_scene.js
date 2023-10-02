const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const addActionManagerToLabel = function (label){
        //highlight a mesh
        const hl = new BABYLON.HighlightLayer("hl1", scene);
        
        //Set up mouseover event
        let actionManager = new BABYLON.ActionManager(scene);
        label.actionManager = actionManager;

        label.isPickable = true;

        //if cursor is hovering over it,  highlight of the mesh
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                hl.addMesh(label, BABYLON.Color3.Teal());
        }));
        //Remove highlight when cursor no longer over mesh
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                hl.removeAllMeshes();
        }));
 
        //recognise click event
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(ev){
                console.log("mesh clicked");
                const input = document.createElement('input');
                input.type = 'file';

                input.onchange = () => {
                        const files = Array.from(input.files);
                        const file = files[0];

                        const reader = new FileReader();
                        reader.onload = function(e) {
                        const contents = e.target.result;

                        var labelTexture = new BABYLON.Texture(contents, scene);
                        labelTexture.name = "labelTex";
                        labelTexture.vScale = -1;

                        label.material.albedoTexture = labelTexture;
                        label.material.backFaceCulling = true;
                        };
                        reader.readAsDataURL(file);
                };
                input.click();
        }));
            
        hl.blurHorizontalSize = 1;
        hl.blurVerticalSize = 1;

}

const createScene = function () {
         // This creates a basic Babylon Scene object (non-mesh)
         const scene = new BABYLON.Scene(engine);

         // This creates and positions a free camera (non-mesh)
         const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

         const container = BABYLON.SceneLoader.LoadAssetContainer("/assets/", "pump_bottle_label_camera_sphere.glb", scene, function (container) {
             
             container.addAllToScene();
 
             //scene camera to one loaded
             scene.activeCamera = container.cameras[0];
             scene.meshes = container.meshes;

             label1 = scene.getMeshByName("Label");

             addActionManagerToLabel(label1);
 
             
                //// GUI
                var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
                var rect1 = new BABYLON.GUI.Rectangle();
                rect1.width = 0.2;
                rect1.height = "40px";
                rect1.cornerRadius = 20;
                rect1.thickness = 4;
                rect1.background = "gray";
                advancedTexture.addControl(rect1);

                rect1.linkWithMesh(label1);   
                rect1.linkOffsetY = 50;
                rect1.linkOffsetX = 175;
                rect1.alpha = 0.5;
                

  
         });
 
         //The background image
         var layer = new BABYLON.Layer('','/assets/pink_label_render.png', scene, true);
 
         // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
         const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
         light.intensity = 7.0;
 
         return scene;
     };

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});