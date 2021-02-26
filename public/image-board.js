new Vue({
    el: "#main",
    data: {
        imageJSON: null,
        title: "",
        file: null,
    },
    mounted: function (){
        axios.get("/api/images")
            .then((res)=>{
                this.imageJSON = res.data;
            })
    },
    methods: {
        uploadImage: function(){
            const uploadData = new FormData();

            uploadData.append("title", this.title)
            uploadData.append("file", this.file)

            axios.post("/api/upload", uploadData)
                .then((response)=>{
                    console.log("upload succesfull", response)
                })
        },
        fileSelected: function (event){
            this.file = event.target.files[0]
        }
    }
})