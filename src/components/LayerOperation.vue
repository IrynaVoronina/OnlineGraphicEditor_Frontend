<template>
    <div class="page-container homePage-container">
      <h1 class="page-title">Layer operation</h1>
      <br>
      <div>
        <button @click="returnToImage" class="page-button">return to the image</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>CANVAS</th>
            <th>Old Position</th>
            <th>New Position</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="layerOrder in layerOrderList" :key="layerOrder.id">
            <td>{{ layerOrder.id }}</td>
            <td>
          <canvas :ref="layerOrder.id" width="200" height="200"></canvas>
        </td>
            <td>{{ layerOrder.position }}</td>
            <td>
              <input v-model="layerOrder.newPosition" type="number" />
            </td>
            <td>
              <button class="operation-button" @click="deleteLayerByID(layerOrder.id)">Delete</button><br>
              <button class="operation-button" @click="copyLayer(layerOrder.id)">Copy</button><br>
              <button class="operation-button" @click="editLayer(layerOrder.id)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <button @click="processLayerOrder" class="page-button">change layer order</button>
    </div>
  </template>

  
<style>
@import "styles/ordersTable.css"; 
</style>

  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        layerOrderList: null,
        imageId: null,
        imageFormat: null,
      };
    },
    mounted() {
      this.imageId = this.$route.query.imageId;
      this.imageFormat = this.$route.query.imageFormat;
      this.getLayers();
    },
    methods: {
      returnToImage(){
        this.$router.push("/image/" + this.imageId);
      },
      getLayers() {
        axios.get(`http://localhost:8080/layer/allLayers`, {
            params: {
              imageId: this.imageId,
            },
          })
          .then((response) => {
            this.layerOrderList = response.data;
            //this.drawLayersOnCanvases();
          })
          .catch((error) => {
            console.error('Error fetching layer order', error);
          });
      },
      deleteLayerByID(layerOrderId){
        axios.delete(`http://localhost:8080/layer/${layerOrderId}`)
          .then((response) => {
            this.getLayers();
          })
          .catch((error) => {
            const exceptionResponse = error.response.data;
            console.error('error:', exceptionResponse.errorMessage); 
            this.$router.push({
                  path: '/errorPage',
                  query: { message: exceptionResponse.errorMessage,
                           imageId: this.imageId}
            });          
          });
      },
      copyLayer(layerOrderId) {
        axios.post(`http://localhost:8080/layer/clone/${layerOrderId}`)
          .then((response) => {
            this.getLayers();
          })
          .catch((error) => {
            console.error('Error fetching layer order', error);
          });
      },
      editLayer(layerOrderId){
          this.$router.push({
            path: '/layer/'+layerOrderId,
            query: { imageId: this.imageId}
          });
      },
      processLayerOrder() {
        axios.post(`http://localhost:8080/layer/updateOrders`, this.layerOrderList)
          .then(() => {
            console.log('Layer order processed successfully');
            this.getLayers();
          })
          .catch((error) => {
            const exceptionResponse = error.response.data;
            console.error('error:', exceptionResponse.errorMessage); 
            this.$router.push({
                  path: '/errorPage',
                  query: { message: exceptionResponse.errorMessage,
                           imageId: this.imageId}
            });          
          });
      },
      getCanvasRef(layerId) {
        const canvasRef = layerId
      return canvasRef;
    },
      drawLayersOnCanvases() {
        this.layerOrderList.forEach(layerOrder => {
          const canvasRef = this.getCanvasRef(layerOrder.id);
          const canvas = this.$refs[canvasRef][0];
    
          const context = canvas.getContext("2d")
          context.clearRect(0, 0, canvas.width, canvas.height);

          const img = new Image();
          img.src = `data:image/${this.imageFormat};base64,${layerOrder.byteData}`;

          img.onload = () => {
            context.globalCompositeOperation = 'source-over';
            context.drawImage(img, 0, 0);
            context.globalCompositeOperation = 'source-over';
          };
        });
      },
    },
    updated() {
    this.drawLayersOnCanvases();
    },
  };
</script>
  