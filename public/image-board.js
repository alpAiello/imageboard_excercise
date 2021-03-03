new Vue({
    el: "#main",
    data: {
        limit: 3,
        restImages: 0,
        lastID: 100000,
        images: null,
        username: "",
        title: "",
        description: "",
        file: null,
        selectedImageID: ""
    },
    mounted: function (){
        axios.get("/api/images/" + this.lastID + "/" + this.limit)
            .then((res)=>{
                console.log(res.data);
                this.images = res.data["imageArray"];
                this.restImages = res.data["restImages"];
                this.lastID = res.data["lastID"];
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
                    this.images.unshift(response.data);
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