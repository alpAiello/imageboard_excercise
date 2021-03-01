new Vue({
    el: "#main",
    data: {
        images: null,
        username: "",
        title: "",
        description: "",
        file: null,
        selectedImageID: ""
    },
    mounted: function (){
        axios.get("/api/images")
            .then((res)=>{
                this.images = res.data;
            });
    },
    methods: {
        uploadImage: function(){
            const uploadData = new FormData();

            uploadData.append("title", this.title);
            uploadData.append("username", this.username);
            uploadData.append("file", this.file);
            uploadData.append("description", this.description);
            axios.post("/api/upload", uploadData)
                .then((response)=>{
                    console.log("upload successfully", response.data);
                    this.images.push(response.data);
                })
                .catch(err=> err);
        },
        fileSelected: function (event){
            this.file = event.target.files[0];
        }
    }
});

Vue.component("modal",{
    data: function(){
        return {
            image: { }
        };
    },
    props: ["id"],
    template: "#modal",
    mounted: function() {
        axios.get("/api/image/" + this.id)
            .then((res)=>{
                this.image = res.data;
            });
    }
});