new Vue({
    el: "#main",
    data: {
        images: null,
        username: "",
        title: "",
        description: "",
        file: null,
    },
    mounted: function (){
        axios.get("/api/images")
            .then((res)=>{
                this.images = res.data;
            });
    },
    methods: {
        showInModal: function(){
            console.log("HELLO MODAL");
        },
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
    data: function () {
        return{
            username: "",
            title: "",
            description: "",
            url:""
        };
    },
    template: "#modal"
});