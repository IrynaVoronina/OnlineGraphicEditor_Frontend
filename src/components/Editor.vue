<template>
<div class=" centered-container">
  <div class="page-container ">
    <div class="navigation-bar">
      <div class="left-section">
        <div v-if="showTools"><button @click="save" class="page-button">save</button></div>    
        <div v-if="showTools">
          <button @click="saveAs" class="page-button">saveAs</button>
          <input type="text" v-model="fullImagePath"  >
        </div>
      </div>

      <div class="middle-section"></div>

      <div class="right-section">
        <button v-if="showTools" @click="layerOperation" class="page-button">LayerOperation</button>
        <button v-if="showReturnButton" @click="returnToImage" class="page-button">return to the image</button>
      </div>
    </div>

    <hr>

    <div class="tool-bar">
      <div class="middle-section"></div>
      <input type="color" class="element" v-model="selectedColor" @input="handleColorChange" />

      <button @click="startAddingText()" class="element" style="color: black;">TEXT</button>

  
      <!-- Кнопка для кола -->
    <button @click="setType('circle')">
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="none" stroke="black" />
      </svg>
    </button>

    <!-- Кнопка для лінії -->
    <button @click="setType('line')">
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <line x1="2" y1="22" x2="22" y2="2" stroke="black" />
      </svg>
    </button>

    <!-- Кнопка для прямокутника -->
    <button @click="setType('rectangle')">
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="14" fill="none" stroke="black" />
      </svg>
    </button>

    <!-- Кнопка для трикутника -->
    <button @click="setType('triangle')">
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="2,22 12,2 22,22" fill="none" stroke="black" />
      </svg>
    </button>
 

  <div class="middle-section"></div>
       
    </div>
   
    <div class="additional-bar">
      <div class="left-section">
      <div v-if="showTools">
        <select v-model="selectedEffect">
          <option disabled selected> -VISUAL EFFECT-</option>
          <option value="blackAndWhite">blackAndWhite</option>
          <option value="infrared">infrared</option>
          <option value="sepia">sepia</option>
          <option value="redColored">redColored</option>
        </select>
  
        <button @click="applyEffect" class="page-button">Apply effect</button>
    </div> 
      <!-- Панель інструментів для тексту -->
  </div>
  <div class="middle-section" v-if="showTextPanel">
    <div v-if="mode === 'text'">
        <label for="textToAdd">Text to add:</label>
        <input type="text" v-model="textToAdd" placeholder="text to add" />

        <label for="fontName">Font name:</label>
        <input type="text" v-model="fontName" placeholder="font name" />

        <label for="fontSize">Font size:</label>
        <input type="number" v-model="fontSize" />
    </div>
  </div>
  <div class="middle-section"></div>
  
    <div class="right-section">
      <button @click="deleteElement" v-if="elementExists" class="page-button">Delete added element</button>
      <button @click="addLayer" v-if="showTools" class="page-button">Add layer</button>
    </div>
    </div>
    <hr>
    <div class="centered-container canvas-div">
        <canvas class="editor-canvas" width="800" height="800" ref="editorCanvas" @click="handleCanvasClick"></canvas>
    </div>
  </div>
</div>
</template>

<style>
@import "styles/editor.css"; 
</style>

<script>
 import axios from "axios";
export default {
  data() {
    return {
      image: null,
      imageId: null,
      layerId: null,

      colorId: null,
      selectedColor: "#ffffff",

      coordinates: [],

      mode: "",
      textElementId: null,
      elementExists: false,

      showTextPanel:false,

      textToAdd: "",
      fontName: "Arial",
      fontSize: 40,

      type: "", 

      selectedEffect: null,
      showTools: true,
      showReturnButton: true,

      height: "",
      width: "",

      imageName: "",
      imageFormat: "",
      path: "D:/"
    };
  },
  mounted() {
        this.onRouteChange()
  },
  
  methods: {
    getLayerFromBackend() {
      const backendUrl = `http://localhost:8080/layer/${this.layerId}`
      console.log("layerId: ", this.layerId)
        axios.get(backendUrl)
          .then(response => {
            this.layer = response.data;
            this.image = response.data.image;
            this.drawLayerOnCanvas(this.image.width, this.image.height);
          })
          .catch(error => {
            console.error("Error fetching image", error);
          });
    },
    drawLayerOnCanvas(width, height) {
        const canvas = this.$refs.editorCanvas;

        const context = canvas.getContext('2d');
  
        const img = new Image();

        img.src = `data:image/${this.image.format};base64,${this.layer.byteData}`;
  
        img.onload = () => {
          canvas.width = width;
          canvas.height = height;

            context.drawImage(img, 0, 0);
        };
    },
    getImageFromBackend() {
      const backendUrl = `http://localhost:8080/image/${this.imageId}`
        axios.get(backendUrl)
          .then(response => {
            this.image = response.data;
            this.imageName = this.image.name;
            this.imageFormat = this.image.format;
            this.drawLayersOnCanvas();
          })
          .catch(error => {
            console.error("Error fetching image", error);
          });
    },
    drawLayersOnCanvas() {
        const canvas = this.$refs.editorCanvas;
        
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, this.image.width, this.image.height);
        
        this.image.layers.forEach(layer => {
          console.log("layerID:", layer.id)
          const img = new Image();
          img.src = `data:image/${this.image.format};base64,${layer.byteData}`;

          img.onload = () => {
            context.globalCompositeOperation = 'source-over';

            canvas.width = this.image.width;
            canvas.height = this.image.height

            context.drawImage(img, 0, 0);
            context.globalCompositeOperation = 'source-over';
          };
        });
    },
    addLayer() {
        const backendUrl = `http://localhost:8080/image/addLayer`;
        axios.post(backendUrl, null, {
        params: {
            imageId: this.imageId
        }})
          .then(response => {
            this.layerId = response.data.id;            
            //this.$router.push(`/layer/${this.layerId}`);
          })
          .catch(error => {
            console.error("Error adding layer", error);
          });
    },
    handleColorChange() {
      const backendUrl = `http://localhost:8080/color/setColor`;
          axios.post(backendUrl, {
            hexCode: this.selectedColor,
          }, 
          {headers: {
            'Content-Type': 'application/json'
          }})
          .then(response => {
            this.colorId = response.data.id;
            this.selectedColor = response.data.hexCode;
          })
          .catch(error => {
            console.error("Error adding text", error);
          });
      
    },
    startAddingText() {
      this.showTextPanel=true;
        this.mode = 'text';
    },
    addText(){
      const backendUrl = `http://localhost:8080/element/addText`;
    
            axios.put(backendUrl, {
            fontName: this.fontName,
            size: this.fontSize,
            text: this.textToAdd,
            colorId: this.colorId,
            coordinates: this.coordinates,
            layerId: this.layerId
          }, 
          {headers: {
            'Content-Type': 'application/json'
          }})
          .then(response => {
            this.elementId = response.data.details.id;

            console.log("Text added successfully");
            this.elementExists = true;
            this.getLayerFromBackend(`http://localhost:8080/layer/${this.layerId}`)
          })
          .catch(error => {
            console.error("Error adding text", error);
          });
    },
    setType(type) {
      this.type = type;
      this.mode = "graphicPrimitive";
    },
    addGraphicPrimitive(){
      const backendUrl = `http://localhost:8080/element/addGraphicPrimitive`;
          axios.put(backendUrl, {
            type: this.type,
            colorId: this.colorId,
            coordinates: this.coordinates,
            layerId: this.layerId
          }, 
          {headers: {
            'Content-Type': 'application/json'
          }})
          .then(response => {
            this.elementId = response.data.details.id;
            this.elementExists = true;
            console.log("GraphicPrimitive added successfully");
            this.getLayerFromBackend(`http://localhost:8080/layer/${this.layerId}`)
          })
          .catch(error => {
            console.error("Error adding text", error);
          });
    },
    deleteElement(){
        axios.delete(`http://localhost:8080/element/${this.elementId}`)
        .then(response => {
            this.elementExists = false;
            this.getLayerFromBackend(`http://localhost:8080/layer/${this.layerId}`)
          })
          .catch(error => {
            console.error("Error fetching image", error);
          });
    },
    handleCanvasClick(event) {
      const rect = this.$refs.editorCanvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      console.log("mouseX:", mouseX, " - mouseY:", mouseY);
      
      if (this.mode === 'text') {
        this.coordinates = [mouseX, mouseY];
        this.addText();
        this.coordinates=[];
      } else if (this.mode === 'graphicPrimitive') {
        this.coordinates.push(mouseX, mouseY);
        console.log(this.coordinates)

        if ((this.type === 'rectangle' || this.type === 'line' || this.type === 'circle') && this.coordinates.length === 4) {
          this.addGraphicPrimitive();
          this.coordinates=[];
        } else if (this.type === 'triangle' && this.coordinates.length === 6) {
          this.addGraphicPrimitive();
          this.coordinates=[];
        }
      }
    },
    save(){
        axios.post(`http://localhost:8080/image/save`, null, {
        params: {
            imageId: this.imageId
        }})
        .then(response => {
            this.getImageFromBackend(`http://localhost:8080/image/${this.imageId}`)
          })
          .catch(error => {
          const exceptionResponse = error.response.data;
          console.error('error:', exceptionResponse.errorMessage); 
          this.$router.push({
            path: '/errorPage',
            query: { message: exceptionResponse.errorMessage,
                           imageId: undefined}
          }); 
        });
    },
    saveAs(){
        axios.post(`http://localhost:8080/image/saveAs`, null, {
        params: {
            id: this.imageId,
            name: this.imageName,
            format: this.imageFormat,
            location: this.path
        }})
        .then(response => {
            this.getImageFromBackend(`http://localhost:8080/image/${this.imageId}`)
          })
          .catch(error => {
            console.error("Error fetching image", error);
          });
    },
      applyEffect(){
        const urlApply = `http://localhost:8080/image/${this.imageId}/applyVisualEffect`;
        const effect = this.selectedEffect
        
        axios.put(urlApply, null, {
        params: {
            effect: effect
        }}).then(response => {
            this.imageId = response.data.id;
            this.image = response.data;
            this.drawLayersOnCanvas(this.image.width, this.image.height);
            
            console.log("Effect applied successfully");
        })
          .catch(error => {
            console.error("Error applying effect", error);
        });
      },
      layerOperation(){
        this.$router.push({
            path: "/image/" + this.imageId + "/layerOperation",
            query: { imageFormat: this.image.format,
              imageId: this.image.id}
        });
        //this.$router.push("/image/" + this.imageId + "/layerOperation");
      },
      returnToImage(){
        this.showTextPanel=false;
        this.elementExists=false;
        this.$router.push("/image/" + this.imageId);
      },
      updateToolsVisibility() {
      const routeName = this.$route.name;

      if (routeName === 'imageEditor') {
        this.showTools = true;
        this.showReturnButton = false;
      } else if (routeName === 'layerEditor') {
        this.showTools = false;
        this.showReturnButton = true;
      }
      }, 
      onRouteChange() {
        const imageIdFromLayer = this.$route.query.imageId;
        if ( imageIdFromLayer !== undefined ){
            this.imageId = imageIdFromLayer
            this.showTools=false;
            this.elementExists=false;
            this.layerId = this.$route.params.layerId;
            if (this.layerId !== undefined) {
                this.getLayerFromBackend();
            }
        } 
        const imageIdFromStart = this.$route.params.imageId;
        if (imageIdFromStart !== undefined){
            this.imageId = this.$route.params.imageId;
            
            this.getImageFromBackend();
        }
      },
    },
  created() {    
    this.updateToolsVisibility();
  },
  computed: {
    fullImagePath: {
      get() {
        return this.path + this.imageName + "." + this.imageFormat;
      },
      set(value) {
        const parts = value.match(/(.*\/)?(.*?)\.(.*)/);
        if (parts) {
          this.path = parts[1] || ""; 
          this.imageName = parts[2] || "";
          this.imageFormat = parts[3] || "";
        }
      },
    },
  },
  
  watch: {
    $route(to, from) {
      this.onRouteChange();
      this.updateToolsVisibility();
    },
  },
  };
  </script>
  